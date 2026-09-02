<script setup lang="ts">
/**
 * 标签页 [tag]
 * 显示含该标签的全部文章（blog + docs 合并，按 date 倒序）
 * 不返回 404，标签是自由集合；如无匹配显示友好空状态
 */

const route = useRoute()
const tag = route.params.tag as string

// 查询 blog 和 docs 中含该标签的全部文章
const { data: blogPosts } = await useAsyncData(`tag-blog-${tag}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

const { data: docsPosts } = await useAsyncData(`tag-docs-${tag}`, () =>
  queryCollection('docs')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

useHead({ title: `${tag} · Fa·ce` })

/**
 * 合并 blog 和 docs，筛选含该标签的文章
 */
const allPosts = computed(() => {
  const blog = blogPosts.value ?? []
  const docs = docsPosts.value ?? []
  const merged = [...blog, ...docs]

  // 筛选含该标签的文章，已按 date 倒序
  return merged.filter(post => post.tags?.includes(tag))
})

/**
 * 统计所有标签及其频率，用于底部相关标签导航
 */
const allTags = computed(() => {
  const count = new Map<string, number>()
  const blog = blogPosts.value ?? []
  const docs = docsPosts.value ?? []
  const merged = [...blog, ...docs]

  for (const post of merged) {
    for (const t of post.tags ?? []) {
      if (t !== tag) { // 排除当前标签
        count.set(t, (count.get(t) ?? 0) + 1)
      }
    }
  }

  // 按频率倒序，取前 8 个
  return [...count]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([t]) => t)
})
</script>

<template>
  <!-- 页头：title 传值仅用于满足 PageHeader 的必填 prop，实际标题由 #title slot 承载 -->
  <PageHeader kicker="Tag" :title="tag" :meta="`共 ${allPosts.length} 篇文章`">
    <template #title>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="u-mono text-sm font-semibold" style="color: var(--accent-text)">
          标签
        </span>
        <span class="u-mono">{{ tag }}</span>
      </div>
    </template>
  </PageHeader>

  <div class="mx-auto max-w-5xl px-4 sm:px-6 pb-4">
    <!-- 文章列表 -->
    <section v-if="allPosts.length" aria-labelledby="post-list-heading" class="pt-8">
      <h2 id="post-list-heading" class="sr-only">文章列表</h2>
      <PostCard
        v-for="post in allPosts"
        :key="post.path"
        :path="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :category="post.category"
        :tags="post.tags"
      />
    </section>

    <!-- 空状态 -->
    <EmptyState
      v-else
      title="暂无标记该标签的文章"
      icon="search"
    >
      <template #action>
        <NuxtLink
          to="/blog"
          class="tag-link inline-flex items-center h-11 px-4 rounded-md border text-sm cursor-pointer transition-colors duration-200"
          style="border-color: var(--border); color: var(--fg-muted)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="mr-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回博客列表
        </NuxtLink>
      </template>
    </EmptyState>

    <!-- 相关标签导航 -->
    <section
      v-if="allTags.length"
      aria-labelledby="related-tags-heading"
      class="pt-12"
    >
      <!-- 栏目头：粗线 + 栏目标记 -->
      <h2
        id="related-tags-heading"
        class="u-kicker u-rule-bold pt-4"
      >
        相关标签
      </h2>
      <ul class="mt-4 flex flex-wrap gap-2">
        <li v-for="t in allTags" :key="t">
          <NuxtLink
            :to="`/tag/${t}`"
            class="tag-link tag-pill inline-flex items-center min-h-11 py-1 px-3 rounded-md border text-xs u-mono cursor-pointer transition-colors duration-200"
            style="border-color: var(--border); color: var(--fg-muted)"
          >
            {{ t }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* 页面内边框型链接的统一 hover，避免裸 a 选择器波及 PostCard 等子组件 */
.tag-link:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--fg);
}

/* 相关标签药丸再进一步走金色系强调；同特异性，靠源码顺序覆盖 .tag-link */
.tag-pill:hover {
  border-color: var(--accent);
  color: var(--accent-text);
}
</style>
