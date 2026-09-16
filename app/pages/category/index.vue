<script setup lang="ts">
/**
 * 分类总览页
 * 展示全部 7 个分类，每个分类展示其在 blog 和 docs 中的文章总数
 */

const { data: blogPosts } = await useAsyncData('category-blog', () =>
  queryCollection('blog').where('draft', '=', false).select('path', 'category').all()
)

const { data: docsPosts } = await useAsyncData('category-docs', () =>
  queryCollection('docs').where('draft', '=', false).select('path', 'category').all()
)

useHead({ title: '分类 · Fa·ce' })

/**
 * 统计每个分类下的文章数（blog + docs）
 */
const categoryStats = computed(() => {
  const count = new Map<string, number>()

  const allPosts = [...(blogPosts.value ?? []), ...(docsPosts.value ?? [])]
  for (const p of allPosts) {
    if (p.category) {
      count.set(p.category, (count.get(p.category) ?? 0) + 1)
    }
  }

  return CATEGORIES.map(cat => ({
    ...cat,
    count: count.get(cat.slug) ?? 0
  }))
})
</script>

<template>
  <div>
    <PageHeader kicker="Categories" title="分类" :meta="`共 ${categoryStats.length} 个分类`" />

    <div class="mx-auto max-w-5xl px-4 sm:px-6 pb-4">
      <!-- 分类网格 -->
      <section aria-label="分类列表" class="py-12">
        <!-- 12 栅格承载非对称：首格占 8/12，其余 4/12 维持每行 3 列的原有节奏 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          <CategoryCard
            v-for="(cat, i) in categoryStats"
            :key="cat.slug"
            :slug="cat.slug"
            :name="cat.name"
            :desc="cat.desc"
            :count="cat.count"
            :class="i === 0 ? 'cat-lead sm:col-span-2 lg:col-span-8' : 'lg:col-span-4'"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/*
  首格差异化只用金色左边条，不重映射 --surface 到 --accent-soft：
  本页 CategoryCard 会渲染 count（.u-meta 取 --fg-subtle），弱金底上对比度不足 4.5:1。
*/
.cat-lead {
  box-shadow: inset 4px 0 0 var(--accent);
}
</style>
