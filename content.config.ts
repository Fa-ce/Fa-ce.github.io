import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// 与 meta/taxonomy.json v1.1.0 保持一致，改动分类须同步两处
const CATEGORIES = [
  'source-code',
  'devops',
  'visualization',
  'standards',
  'fundamentals',
  'toolchain',
  'interview',
  'ai-agent'
] as const

// 博客与文档共用的 frontmatter 约束
const baseSchema = {
  title: z.string(),
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  source: z.string().optional()
}

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object(baseSchema)
    }),
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object(baseSchema)
    })
  }
})
