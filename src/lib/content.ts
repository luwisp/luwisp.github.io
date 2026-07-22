import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export async function getPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("posts");
  return posts.sort((left, right) => right.data.date.valueOf() - left.data.date.valueOf());
}

export function getCategories(posts: PostEntry[]) {
  return [...new Set(posts.map((post) => post.data.category))].sort((left, right) =>
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
