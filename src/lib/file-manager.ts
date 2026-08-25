import {
  getFolderDescription,
  getFolderLabel,
  getPostCategory,
  getPostHref,
  type PostEntry
} from "./content";

export interface FileManagerEntry {
  type: "folder" | "file";
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
  category?: string;
  tags: string[];
  minutes?: number;
}

function bodySize(body: string | undefined) {
  return new TextEncoder().encode(body ?? "").byteLength;
}

export function getFileManagerEntries(posts: PostEntry[]): FileManagerEntry[] {
  const files: FileManagerEntry[] = posts.map((post) => {
    const segments = post.id.split("/").filter(Boolean);
    const basename = segments.at(-1) ?? post.id;
    return {
      type: "file",
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
      category: getPostCategory(post),
      tags: post.data.tags,
      minutes: post.data.minutes
    };
  });

  const folderPaths = new Set<string>();
  for (const file of files) {
    const segments = file.parentPath.split("/").filter(Boolean);
    for (let index = 1; index <= segments.length; index += 1) {
      folderPaths.add(segments.slice(0, index).join("/"));
    }
  }

  const folders = [...folderPaths].map<FileManagerEntry>((path) => {
    const segments = path.split("/");
    const descendants = files.filter((file) => file.path.startsWith(`${path}/`));
    const directFolders = [...folderPaths].filter((folderPath) => {
      const folderSegments = folderPath.split("/");
      return folderSegments.length === segments.length + 1 && folderPath.startsWith(`${path}/`);
    });
    const directFiles = files.filter((file) => file.parentPath === path);
    const latest = descendants.reduce((value, entry) => Math.max(value, entry.modifiedTime), 0);
    return {
      type: "folder",
      path,
      parentPath: segments.slice(0, -1).join("/"),
      name: segments.at(-1) ?? path,
      displayName: getFolderLabel(path),
      description: getFolderDescription(path),
      modifiedAt: latest ? new Date(latest).toISOString() : "",
      modifiedTime: latest,
      sizeBytes: descendants.reduce((total, entry) => total + entry.sizeBytes, 0),
      itemCount: directFolders.length + directFiles.length,
      tags: []
    };
  });

  return [...folders, ...files];
}
