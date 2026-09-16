<script setup lang="ts">
/**
 * 分类详情页 [slug]
 * 显示单个分类下的全部文章（blog + docs 合并，按 date 倒序）
 */

const route = useRoute()
const slug = route.params.slug as string

// 验证分类是否存在
const category = categoryOf(slug)
if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
    fatal: true
  })
}

// 查询 blog 和 docs 中该分类的全部文章
const { data: blogPosts } = await useAsyncData(`category-blog-${slug}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .where('category', '=', slug)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

const { data: docsPosts } = await useAsyncData(`category-docs-${slug}`, () =>
  queryCollection('docs')
    .where('draft', '=', false)
    .where('category', '=', slug)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

useHead({ title: `${category.name} · Fa·ce` })

/**
 * 合并 blog 和 docs，按 date 倒序
 */
const allPosts = computed(() => {
  const blog = blogPosts.value ?? []
  const docs = docsPosts.value ?? []
  const merged = [...blog, ...docs]

  // 按 date 倒序排列，注意处理 date 可能为 undefined
  return merged.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

/**
 * 为每条文章标记其来源（blog 或 docs）
 */
const postsWithSource = computed(() =>
  allPosts.value.map(post => ({
    ...post,
    source: blogPosts.value?.some(p => p.path === post.path) ? 'blog' : 'docs'
  }))
)
</script>

<template>
  <div>
    <PageHeader
      :kicker="slug"
      :title="category.name"
      :meta="`共 ${allPosts.length} 篇文章`"
      :description="category.desc"
    />

    <div class="mx-auto max-w-5xl px-4 sm:px-6 pb-4">
      <!-- 文章列表 -->
      <section v-if="allPosts.length" aria-label="文章列表" class="pt-8">
        <template v-for="(post, idx) in postsWithSource" :key="post.path">
          <!-- 来源分组标题：语义上是该组的 h2，视觉上是「粗线 + 栏目标记」的栏目头 -->
          <h2
            v-if="idx === 0 || postsWithSource[idx - 1].source !== post.source"
            class="u-kicker u-rule-bold mt-12 first:mt-0 mb-5 pt-4"
          >
            {{ post.source === 'blog' ? '博客文章' : '知识库' }}
          </h2>

          <PostCard
            :path="post.path"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :category="post.category"
            :tags="post.tags"
          />
        </template>
      </section>

      <!-- 空状态 -->
      <EmptyState v-else title="暂无文章" description="这个分类下还没有文章，敬请期待" icon="inbox">
        <template #action>
          <NuxtLink
            to="/category"
            class="back-link inline-flex items-center h-11 px-4 rounded-md border text-sm cursor-pointer transition-colors duration-200"
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
            返回分类总览
          </NuxtLink>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped>
/* 空状态返回链接原本声明了 transition-colors 却无对应 hover 规则，补上新色板的次级表面 */
.back-link:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--fg);
}
</style>
