import { getCollection, type CollectionEntry } from "astro:content";
import folderData from "../../content/folders.json";

export type PostEntry = CollectionEntry<"posts">;

export async function getPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("posts");
  return posts.sort((left, right) => right.data.date.valueOf() - left.data.date.valueOf());
}

const folderDefinitions = folderData as Record<string, { label: string; description: string }>;

function fallbackFolderLabel(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getFolderLabel(path: string) {
  const segment = path.split("/").filter(Boolean).at(-1) ?? "文章";
  return folderDefinitions[path]?.label ?? fallbackFolderLabel(segment);
}

export function getFolderDescription(path: string) {
  return folderDefinitions[path]?.description ?? `${getFolderLabel(path)}目录中的文章。`;
}

export function getPostCategory(post: PostEntry) {
  const rootFolder = post.id.split("/").filter(Boolean)[0] ?? "articles";
  return post.data.category ?? getFolderLabel(rootFolder);
}

export function getPostHref(post: PostEntry) {
  return `/posts/${post.id.split("/").map(encodeURIComponent).join("/")}/`;
}

export function getCategories(posts: PostEntry[]) {
  return [...new Set(posts.map(getPostCategory))].sort((left, right) =>
    left.localeCompare(right, "zh-CN")
  );
}

export function groupPostsByYear(posts: PostEntry[]) {
  return posts.reduce<Record<string, PostEntry[]>>((groups, post) => {
    const year = String(post.data.date.getFullYear());
    (groups[year] ??= []).push(post);
    return groups;
  }, {});
}
