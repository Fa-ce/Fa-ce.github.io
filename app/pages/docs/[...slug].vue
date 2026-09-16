<script setup lang="ts">
/**
 * 文档详情页（三栏阅读布局）
 * 左：章节树（sticky 独立滚动）｜ 中：正文 ｜ 右：文内目录（sticky）
 * 断点降级：≥1280 三栏 → 1024~1280 两栏（目录折叠进正文上方）→ <1024 单栏（章节树也折叠）
 */

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const route = useRoute()
// GitHub Pages 等静态托管会把 /blog/x 重定向为 /blog/x/，
// 而 content 库中存的 path 无尾斜杠，不规范化会导致线上详情页查不到内容而报 404
const canonicalPath = route.path.replace(/\/+$/, '') || '/'

const { data: page } = await useAsyncData('doc-' + canonicalPath, () =>
  queryCollection('docs').path(canonicalPath).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: '文档不存在', fatal: true })
}

// 与索引页共用 key，同一份列表数据只请求一次
const { data: docs } = await useAsyncData('docs-all', () =>
  queryCollection('docs')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

useHead({
  title: computed(() => `${page.value?.title ?? '文档'} · 文档 · Fa·ce`),
  meta: [{ name: 'description', content: computed(() => page.value?.description ?? '') }]
})

const allDocs = computed(() => docs.value ?? [])

const tocLinks = computed<TocLink[]>(
  () => (page.value?.body as { toc?: { links?: TocLink[] } } | undefined)?.toc?.links ?? []
)

/* ---------------- 上一篇 / 下一篇 ---------------- */

/** 同分类内取相邻项，顺序与章节树完全一致（date DESC），所以「上一篇」就是树里排在上方的那篇 */
const siblings = computed(() =>
  allDocs.value.filter(d => d.category && d.category === page.value?.category)
)

const cursor = computed(() => siblings.value.findIndex(d => d.path === canonicalPath))
const prev = computed(() => (cursor.value > 0 ? siblings.value[cursor.value - 1] : undefined))
const next = computed(() => (cursor.value >= 0 ? siblings.value[cursor.value + 1] : undefined))
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
    <div
      class="grid gap-x-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_15rem]"
    >
      <!-- 左栏：≥1024 常驻，sticky 且独立滚动 -->
      <aside class="doc-rail hidden lg:block pt-8">
        <p class="u-kicker u-rule-bold pt-3 mb-3">文档章节</p>
        <DocTree :items="allDocs" :current-path="canonicalPath" />
      </aside>

      <!-- 中栏：正文 -->
      <div class="min-w-0 pt-6 lg:pt-8">
        <!-- <1024：章节树收进折叠面板 -->
        <details class="panel lg:hidden mb-6 rounded-md border">
          <summary class="panel-summary flex items-center gap-2 min-h-11 px-3 cursor-pointer">
            <svg
              class="chevron shrink-0"
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
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span class="flex-1 text-sm font-medium">文档章节</span>
            <span class="u-meta">{{ allDocs.length }}</span>
          </summary>
          <div class="px-3 pb-2 max-h-[60vh] overflow-y-auto">
            <DocTree :items="allDocs" :current-path="canonicalPath" />
          </div>
        </details>

        <article style="max-width: var(--measure)">
          <!-- 文档头：面包屑 → 栏目标记 → 标题 → 导语 -->
          <header class="pb-6 mb-8 border-b" style="border-color: var(--border)">
            <nav aria-label="面包屑" class="flex flex-wrap items-center gap-x-2 gap-y-1 u-meta">
              <NuxtLink
                to="/docs"
                class="crumb inline-flex items-center min-h-11 cursor-pointer transition-colors duration-200"
              >
                文档
              </NuxtLink>
              <span v-if="page?.category" class="sep" aria-hidden="true">/</span>
              <NuxtLink
                v-if="page?.category"
                :to="{ path: '/docs', hash: `#cat-${page.category}` }"
                class="crumb inline-flex items-center min-h-11 cursor-pointer transition-colors duration-200"
                style="color: var(--accent-text)"
              >
                {{ categoryName(page.category) }}
              </NuxtLink>
              <time v-if="page?.date" :datetime="page.date" class="ml-auto">
                {{ formatDate(page.date) }}
              </time>
            </nav>

            <p class="u-kicker u-rule-bold mt-1 pt-3">Documentation</p>

            <h1 class="u-h1 mt-2">
              {{ page?.title }}
            </h1>
            <p
              v-if="page?.description"
              class="mt-3 text-base leading-relaxed"
              style="color: var(--fg-muted)"
            >
              {{ page.description }}
            </p>
          </header>

          <!-- <1280：目录收进正文上方的折叠面板 -->
          <details v-if="tocLinks.length" class="panel xl:hidden mb-8 rounded-md border">
            <summary class="panel-summary flex items-center gap-2 min-h-11 px-3 cursor-pointer">
              <svg
                class="chevron shrink-0"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span class="flex-1 text-sm font-medium">本页目录</span>
            </summary>
            <div class="px-3 pb-3">
              <ArticleToc :links="tocLinks" />
            </div>
          </details>

          <!-- 正文：视觉主题全部来自 main.css 的 .prose -->
          <ContentRenderer v-if="page" :value="page" class="prose" />

          <!-- 上一篇 / 下一篇：同分类内相邻 -->
          <nav v-if="prev || next" aria-label="文档翻页" class="mt-14 u-rule-bold pt-4">
            <p class="u-kicker">Next</p>
            <h2 class="u-h3 mt-1">继续阅读</h2>

            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <NuxtLink
                v-if="prev"
                :to="prev.path"
                class="pager flex flex-col gap-1 p-4 rounded-md border cursor-pointer transition-colors duration-200"
                rel="prev"
              >
                <span class="inline-flex items-center gap-1.5 u-meta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  上一篇
                </span>
                <span class="text-sm font-medium leading-snug">{{ prev.title }}</span>
              </NuxtLink>
              <span v-else class="hidden sm:block" aria-hidden="true" />

              <NuxtLink
                v-if="next"
                :to="next.path"
                class="pager flex flex-col gap-1 p-4 rounded-md border cursor-pointer transition-colors duration-200 sm:items-end sm:text-right"
                rel="next"
              >
                <span class="inline-flex items-center gap-1.5 u-meta">
                  下一篇
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
                <span class="text-sm font-medium leading-snug">{{ next.title }}</span>
              </NuxtLink>
            </div>
          </nav>
        </article>
      </div>

      <!-- 右栏：文内目录，≥1280 才出现 -->
      <aside v-if="tocLinks.length" class="doc-rail hidden xl:block pt-8">
        <ArticleToc :links="tocLinks" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* 侧栏吸顶：align-self 必须为 start，否则网格项被拉伸后 sticky 失效 */
.doc-rail {
  position: sticky;
  top: calc(var(--header-h) + 1rem);
  align-self: start;
  max-height: calc(100vh - var(--header-h) - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.crumb:hover {
  color: var(--fg);
}

/* 面包屑分隔符：金色小点缀，区隔层级 */
.sep {
  color: var(--accent);
}

/* 折叠面板：窄屏下承载章节树与目录 */
.panel {
  border-color: var(--border);
  background: var(--surface);
}
.panel-summary {
  list-style: none;
  color: var(--fg);
  transition: color 200ms ease;
}
.panel-summary::-webkit-details-marker {
  display: none;
}
.panel-summary::marker {
  content: '';
}
.panel-summary:hover {
  color: var(--accent-text);
}
.chevron {
  color: var(--fg-subtle);
  transition: transform 200ms ease;
}
details[open] > .panel-summary .chevron {
  transform: rotate(90deg);
}

.pager {
  border-color: var(--border);
  color: var(--fg-muted);
  min-height: 2.75rem;
}
.pager:hover {
  color: var(--fg);
  background: var(--surface-2);
  border-color: var(--border-strong);
}
</style>
