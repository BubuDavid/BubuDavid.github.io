import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string(),
    topicLabel: z.string(),
    publishedDate: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    image: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    platform: z.string().optional(),
    url: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    publishedDate: z.string(),
    tags: z.array(z.string()),
    mood: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    url: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = { blog, projects, courses, notes, resources };
