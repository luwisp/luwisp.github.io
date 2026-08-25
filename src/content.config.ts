import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/articles" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    minutes: z.number().int().positive().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional()
  })
});

export const collections = { posts };
