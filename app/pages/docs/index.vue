<script setup lang="ts">
/**
 * 文档索引页
 * docs 为扁平结构，按 category 分组成章节；数据一次取回，分组在客户端完成。
 * key 与文档详情页共用 'docs-all'，两处共享同一份 payload。
 */

const { data: docs } = await useAsyncData('docs-all', () =>
  queryCollection('docs')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

useHead({
  title: '文档 · Fa·ce',
  meta: [
    {
      name: 'description',
      content: '按主题分章的技术文档合集：可视化、规范、原理、工具链与面试题。'
    }
  ]
})

const allDocs = computed(() => docs.value ?? [])

type DocRow = (typeof allDocs.value)[number]

/** 分组顺序沿用 taxonomy 定义，字典外的 slug 兜底排在最后 */
const groups = computed(() => {
  const map = new Map<string, DocRow[]>()
  for (const d of allDocs.value) {
    const slug = d.category || 'uncategorized'
    const bucket = map.get(slug)
    if (bucket) bucket.push(d)
    else map.set(slug, [d])
  }
  const order = new Map(CATEGORIES.map((c, i) => [c.slug, i]))
  return [...map]
    .sort(
      (a, b) =>
        (order.get(a[0]) ?? Number.MAX_SAFE_INTEGER) - (order.get(b[0]) ?? Number.MAX_SAFE_INTEGER)
    )
    .map(([slug, items]) => ({
      slug,
      name: categoryName(slug) || '未分类',
      desc: categoryOf(slug)?.desc ?? '',
      items
    }))
})

/** 主入口指向页面上出现的第一篇，与视觉顺序一致 */
const firstDoc = computed(() => groups.value[0]?.items[0])
</script>

<template>
  <!-- 页头：已与下方容器平级，无双重 padding 问题 -->
  <PageHeader
    kicker="Docs"
    title="文档"
    :meta="`共 ${allDocs.length} 篇文档 · ${groups.length} 个章节`"
  >
    <template #actions>
      <NuxtLink
        v-if="firstDoc"
        :to="firstDoc.path"
        class="cta inline-flex items-center gap-2 min-h-11 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200"
        :aria-label="`开始阅读：${firstDoc.title}`"
      >
        开始阅读
        <span class="hidden sm:inline opacity-70">· {{ firstDoc.title }}</span>
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
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </template>
  </PageHeader>

  <div class="mx-auto max-w-5xl px-4 sm:px-6 pb-16">
    <template v-if="groups.length">
      <!-- 章节快速跳转 -->
      <nav aria-label="章节导航" class="py-4 border-b" style="border-color: var(--border)">
        <ul class="flex flex-wrap gap-2">
          <li v-for="g in groups" :key="g.slug">
            <a
              :href="`#cat-${g.slug}`"
              class="jump inline-flex items-center gap-1.5 min-h-11 px-3 rounded-md border u-meta cursor-pointer transition-colors duration-200"
            >
              {{ g.name }}
              <span style="color: var(--fg-subtle)">{{ g.items.length }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- 分章列表 -->
      <section
        v-for="g in groups"
        :id="`cat-${g.slug}`"
        :key="g.slug"
        :aria-labelledby="`cat-${g.slug}-heading`"
        class="pt-10"
        style="scroll-margin-top: calc(var(--header-h) + 1rem)"
      >
        <!-- 栏目头三件套：粗线 + 栏目标记 + 标题 -->
        <div class="u-rule-bold pt-4 pb-4">
          <p class="u-kicker">{{ g.slug }}</p>
          <div class="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 :id="`cat-${g.slug}-heading`" class="u-h2">{{ g.name }}</h2>
            <span class="u-meta">{{ g.items.length }} 篇</span>
          </div>
        </div>
        <p v-if="g.desc" class="pb-6 text-sm" style="color: var(--fg-muted)">{{ g.desc }}</p>

        <PostCard
          v-for="d in g.items"
          :key="d.path"
          :path="d.path"
          :title="d.title"
          :description="d.description"
          :date="d.date"
          :category="d.category"
          :tags="d.tags"
        />
      </section>
    </template>

    <!-- 空状态 -->
    <EmptyState v-else title="暂无文档" description="内容正在整理中，先去看看博客吧" icon="inbox">
      <template #action>
        <NuxtLink
          to="/blog"
          class="jump inline-flex items-center gap-2 min-h-11 px-4 rounded-md border text-sm cursor-pointer transition-colors duration-200"
        >
          前往博客
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
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </template>
    </EmptyState>
  </div>
</template>

<style scoped>
/* 主入口：primary 实底 + on-primary 字，页面上唯一的实心按钮；hover 翻到引文金 */
.cta {
  background: var(--primary);
  color: var(--on-primary);
}
.cta:hover {
  background: var(--accent-text);
}

.jump {
  color: var(--fg-muted);
  border-color: var(--border);
}
.jump:hover {
  color: var(--fg);
  background: var(--surface-2);
  border-color: var(--border-strong);
}
</style>
