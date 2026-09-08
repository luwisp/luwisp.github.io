import {
  getFolderDescription,
  getFolderLabel,
  getPostCategory,
  getPostHref,
  type PostEntry
} from "./content";

export type FileManagerVolumeId = "files" | "music";

export interface MusicTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  coverUrl: string;
  durationMs: number;
  url: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  creator: string;
  trackCount: number;
  updatedAt: string;
  url: string;
  tracks: MusicTrack[];
}

export interface MusicSnapshot {
  generatedAt: string;
  status: string;
  playlists: MusicPlaylist[];
}

export interface FileManagerVolume {
  id: FileManagerVolumeId;
  name: string;
  description: string;
  location: string;
  itemCount: number;
  contentCount: number;
  contentLabel: string;
  sizeBytes: number;
  modifiedAt: string;
}

export interface FileManagerEntry {
  volume: FileManagerVolumeId;
  type: "folder" | "file";
  kind: "folder" | "article" | "playlist" | "track";
  icon: "folder" | "file" | "music";
  path: string;
  parentPath: string;
  name: string;
  displayName: string;
  description: string;
  modifiedAt: string;
  modifiedTime: number;
  sizeBytes: number;
  itemCount: number;
  href?: string;
  external?: boolean;
  typeLabel: string;
  location: string;
  category?: string;
  tags: string[];
  minutes?: number;
  artist?: string;
  album?: string;
  durationMs?: number;
  coverUrl?: string;
}

export interface FileManagerData {
  volumes: FileManagerVolume[];
  entries: FileManagerEntry[];
}

function bodySize(body: string | undefined) {
  return new TextEncoder().encode(body ?? "").byteLength;
}

export function getFileManagerData(posts: PostEntry[], music: MusicSnapshot): FileManagerData {
  const articleFiles: FileManagerEntry[] = posts.map((post) => {
    const segments = post.id.split("/").filter(Boolean);
    const basename = segments.at(-1) ?? post.id;
    return {
      volume: "files",
      type: "file",
      kind: "article",
      icon: "file",
      path: post.id,
      parentPath: segments.slice(0, -1).join("/"),
      name: `${basename}.md`,
      displayName: post.data.title,
      description: post.data.summary,
      modifiedAt: post.data.date.toISOString(),
      modifiedTime: post.data.date.valueOf(),
      sizeBytes: bodySize(post.body),
      itemCount: 0,
      href: getPostHref(post),
      typeLabel: "Markdown",
      location: `content/articles/${post.id}.md`,
      category: getPostCategory(post),
      tags: post.data.tags,
      minutes: post.data.minutes
    };
  });

  const articleFolderPaths = new Set<string>();
  for (const file of articleFiles) {
    const segments = file.parentPath.split("/").filter(Boolean);
    for (let index = 1; index <= segments.length; index += 1) {
      articleFolderPaths.add(segments.slice(0, index).join("/"));
    }
  }

  const articleFolders = [...articleFolderPaths].map<FileManagerEntry>((path) => {
    const segments = path.split("/");
    const descendants = articleFiles.filter((file) => file.path.startsWith(`${path}/`));
    const directFolders = [...articleFolderPaths].filter((folderPath) => {
      const folderSegments = folderPath.split("/");
      return folderSegments.length === segments.length + 1 && folderPath.startsWith(`${path}/`);
    });
    const directFiles = articleFiles.filter((file) => file.parentPath === path);
    const latest = descendants.reduce((value, entry) => Math.max(value, entry.modifiedTime), 0);
    return {
      volume: "files",
      type: "folder",
      kind: "folder",
      icon: "folder",
      path,
      parentPath: segments.slice(0, -1).join("/"),
      name: segments.at(-1) ?? path,
      displayName: getFolderLabel(path),
      description: getFolderDescription(path),
      modifiedAt: latest ? new Date(latest).toISOString() : "",
      modifiedTime: latest,
      sizeBytes: descendants.reduce((total, entry) => total + entry.sizeBytes, 0),
      itemCount: directFolders.length + directFiles.length,
      typeLabel: "文件夹",
      location: `content/articles/${path}`,
      tags: []
    };
  });

  const playlists = music.status === "ready" ? music.playlists : [];
  const musicEntries: FileManagerEntry[] = [];
  for (const playlist of playlists) {
    const playlistPath = playlist.id;
    musicEntries.push({
      volume: "music",
      type: "folder",
      kind: "playlist",
      icon: "folder",
      path: playlistPath,
      parentPath: "",
      name: playlist.name,
      displayName: playlist.name,
      description: playlist.description || `${playlist.creator ? `${playlist.creator} · ` : ""}${playlist.trackCount} 首歌曲`,
      modifiedAt: playlist.updatedAt,
      modifiedTime: playlist.updatedAt ? new Date(playlist.updatedAt).valueOf() : 0,
      sizeBytes: 0,
      itemCount: playlist.tracks.length,
      typeLabel: "文件夹",
      location: playlist.url,
      tags: [],
      coverUrl: playlist.coverUrl.replace(/^http:/, "https:")
    });

    for (const track of playlist.tracks) {
      musicEntries.push({
        volume: "music",
        type: "file",
        kind: "track",
        icon: "music",
        path: `${playlistPath}/${track.id}`,
        parentPath: playlistPath,
        name: track.name,
        displayName: track.name,
        description: [track.artists.join(" / "), track.album].filter(Boolean).join(" · "),
        modifiedAt: "",
        modifiedTime: 0,
        sizeBytes: 0,
        itemCount: 0,
        href: track.url,
        external: true,
        typeLabel: "歌曲",
        location: track.url,
        tags: [],
        artist: track.artists.join(" / "),
        album: track.album,
        durationMs: track.durationMs,
        coverUrl: track.coverUrl.replace(/^http:/, "https:")
      });
    }
  }

  const latestArticleTime = articleFiles.reduce((latest, entry) => Math.max(latest, entry.modifiedTime), 0);
  const fileVolume: FileManagerVolume = {
    id: "files",
    name: "文件",
    description: "博客的主要内容卷，目录结构直接映射自文章内容。",
    location: "content/articles",
    itemCount: articleFolders.filter((entry) => entry.parentPath === "").length
      + articleFiles.filter((entry) => entry.parentPath === "").length,
    contentCount: articleFiles.length,
    contentLabel: "文章",
    sizeBytes: articleFiles.reduce((total, entry) => total + entry.sizeBytes, 0),
    modifiedAt: latestArticleTime ? new Date(latestArticleTime).toISOString() : ""
  };

  const musicVolume: FileManagerVolume = {
    id: "music",
    name: "音乐",
    description: "附加的音乐内容卷，从公开网易云歌单同步。",
    location: "网易云音乐 · 公开歌单快照",
    itemCount: playlists.length,
    contentCount: musicEntries.filter((entry) => entry.kind === "track").length,
    contentLabel: "歌曲",
    sizeBytes: 0,
    modifiedAt: music.generatedAt || ""
  };

  return {
    volumes: [fileVolume, musicVolume],
    entries: [...articleFolders, ...articleFiles, ...musicEntries]
  };
}
