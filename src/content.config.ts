import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import z from "astro/zod";

const blogsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().optional(),
        excerpt: z.string().optional(),
        pubDate: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
        image: z.string().optional(),
        featuredImage: z.string().optional(),
    }),
});

export const collections = {
    blogs: blogsCollection,
};
