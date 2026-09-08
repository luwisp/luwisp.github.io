import { readFile, writeFile } from "node:fs/promises";

const configUrl = new URL("../content/music.json", import.meta.url);
const outputUrl = new URL("../src/data/music.json", import.meta.url);
const config = JSON.parse(await readFile(configUrl, "utf8"));

const keepSnapshot = (reason) => {
  console.warn(`NetEase playlists: ${reason}; keeping the current snapshot.`);
  process.exit(0);
};

const playlists = [];

try {
  for (const source of config.playlists ?? []) {
    const response = await fetch(`https://music.163.com/api/playlist/detail?id=${encodeURIComponent(source.id)}&n=1000`, {
      headers: {
        Referer: "https://music.163.com/",
        "User-Agent": "Mozilla/5.0 (compatible; luwisp-notes-build/1.0)"
      }
    });
    if (!response.ok) throw new Error(`${source.id}: ${response.status} ${response.statusText}`);

    const payload = await response.json();
    const playlist = payload.playlist ?? payload.result;
    if (payload.code !== 200 || !playlist) throw new Error(`${source.id}: playlist unavailable`);

    playlists.push({
      id: String(playlist.id ?? source.id),
      name: playlist.name ?? `歌单 ${source.id}`,
      description: (playlist.description ?? "").trim(),
      coverUrl: playlist.coverImgUrl ?? "",
      creator: playlist.creator?.nickname ?? "",
      trackCount: playlist.trackCount ?? playlist.tracks?.length ?? 0,
      updatedAt: playlist.updateTime ? new Date(playlist.updateTime).toISOString() : "",
      url: source.url || `https://music.163.com/#/playlist?id=${source.id}`,
      tracks: (playlist.tracks ?? []).map((track) => ({
        id: String(track.id),
        name: track.name ?? "未命名歌曲",
        artists: (track.ar ?? track.artists ?? []).map((artist) => artist.name).filter(Boolean),
        album: track.al?.name ?? track.album?.name ?? "",
        coverUrl: track.al?.picUrl ?? track.album?.picUrl ?? "",
        durationMs: track.dt ?? track.duration ?? 0,
        url: `https://music.163.com/#/song?id=${track.id}`
      }))
    });
  }
} catch (error) {
  keepSnapshot(error instanceof Error ? error.message : "request failed");
}

await writeFile(outputUrl, `${JSON.stringify({ generatedAt: new Date().toISOString(), status: "ready", playlists }, null, 2)}\n`, "utf8");
console.log(`NetEase playlists: wrote ${playlists.length} playlists and ${playlists.reduce((n, p) => n + p.tracks.length, 0)} tracks.`);
