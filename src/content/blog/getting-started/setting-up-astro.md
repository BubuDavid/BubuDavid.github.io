---
title: "Setting Up This Site with Astro"
description: "A quick walkthrough of how I built this portfolio with Astro, Tailwind CSS, and content collections."
topic: "getting-started"
topicLabel: "Getting Started"
publishedDate: "2026-03-17"
tags: ["astro", "tailwind", "webdev"]
draft: false
order: 2
---

Building a personal site shouldn't be complicated. Here's how I set mine up with Astro.

## The stack

- **Astro** for static site generation
- **Tailwind CSS** for styling
- **Content Collections** for type-safe markdown

## Why Astro?

Astro ships zero JavaScript by default. For a content-heavy site like this, that's exactly what I want. When I need interactivity later, I can add React islands without rebuilding everything.

## Content Collections

Astro's content collections let me define schemas for my markdown frontmatter. This means I get type checking and autocompletion for all my content — blog posts, projects, courses, and more.

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    topic: z.string(),
    publishedDate: z.string(),
    tags: z.array(z.string()),
  }),
});
```

It's a great developer experience.
