import type { PostEntry } from "./content";

function estimateWords(markdown: string) {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ");
  const cjkCount = withoutCode.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinCount = withoutCode
    .replace(/[\u3400-\u9fff]/g, " ")
    .match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return cjkCount + latinCount;
}

export function getBlogStats(posts: PostEntry[]) {
  const categoryCount = new Set(posts.map((post) => post.data.category)).size;
  const totalWords = posts.reduce((total, post) => total + estimateWords(post.body ?? ""), 0);
  const latestDate = posts[0]?.data.date;

  return {
    postCount: posts.length,
    categoryCount,
    totalWords,
    latestDate
  };
}
