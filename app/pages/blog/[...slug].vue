<script setup lang="ts">
/**
 * 博客详情页
 * 左主栏文章正文 + 右侧吸顶目录；窄屏收成单栏，目录折叠到正文上方。
 */

interface SiblingLink {
  path: string
  title: string
  description?: string
}

const route = useRoute()
// GitHub Pages 等静态托管会把 /blog/x 重定向为 /blog/x/，
// 而 content 库中存的 path 无尾斜杠，不规范化会导致线上详情页查不到内容而报 404
const canonicalPath = route.path.replace(/\/+$/, '') || '/'

const { data: page } = await useAsyncData('blog-' + canonicalPath, () =>
  queryCollection('blog').path(canonicalPath).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

/** 两种数据源字段不完全一致，统一收敛成模板需要的最小结构 */
function toSibling(item: unknown): SiblingLink | null {
  const it = item as Record<string, unknown> | null | undefined
  if (!it || typeof it.path !== 'string' || typeof it.title !== 'string') return null
  return {
    path: it.path,
    title: it.title,
    description: typeof it.description === 'string' ? it.description : undefined
  }
}

/**
 * 上下篇优先用 content 的 surroundings API；
 * 该 API 不可用或抛错时退回按日期升序的全量列表自取相邻项，保证页面不崩。
 */
const { data: siblings } = await useAsyncData('blog-siblings-' + canonicalPath, async () => {
  try {
    const found = await queryCollectionItemSurroundings('blog', canonicalPath, {
      fields: ['title', 'path', 'description']
    })
    if (Array.isArray(found)) {
      const surround = { prev: toSibling(found[0]), next: toSibling(found[1]) }
      // 全空说明当前文章不在导航树里，继续走兜底
      if (surround.prev || surround.next) return surround
    }
  } catch {
    // 忽略，走下面的兜底查询
  }

  const list = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'ASC')
    .select('path', 'title', 'description')
    .all()
  const i = list.findIndex(p => p.path === canonicalPath)
  return i < 0
    ? { prev: null, next: null }
    : { prev: toSibling(list[i - 1]), next: toSibling(list[i + 1]) }
})

const prev = computed(() => siblings.value?.prev ?? null)
const next = computed(() => siblings.value?.next ?? null)
const tocLinks = computed(() => page.value?.body?.toc?.links ?? [])

useHead({
  title: computed(() => `${page.value?.title ?? '文章'} · Fa·ce`),
  meta: [{ name: 'description', content: computed(() => page.value?.description ?? '') }]
})
</script>

<template>
  <div v-if="page" class="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
    <!-- 返回列表 -->
    <div class="pt-6 sm:pt-8">
      <NuxtLink
        to="/blog"
        class="back inline-flex items-center gap-1.5 min-h-11 -ml-2 px-2 u-meta cursor-pointer transition-colors duration-200"
      >
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
        返回博客
      </NuxtLink>
    </div>

    <!--
      容器放宽到 max-w-7xl 后，正文列在 xl 上限封顶 50rem：
      50rem + 4rem 间距 + 15rem 目录 = 69rem，与原 max-w-6xl 的内容区等宽，
      避免正文（受 .prose 的 --measure 68ch 限制）与目录之间被拉出大片空隙。
    -->
    <div
      :class="
        tocLinks.length
          ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] xl:grid-cols-[minmax(0,50rem)_15rem] lg:gap-10 xl:gap-16'
          : ''
      "
    >
      <article class="min-w-0">
        <!-- 文章头：栏目标记 → 标题 → 导语 → byline，编辑风报头结构 -->
        <header class="mt-4">
          <p class="u-kicker u-rule-bold pt-3">Article</p>

          <h1 class="u-h1 mt-2">
            {{ page.title }}
          </h1>

          <p
            v-if="page.description"
            class="mt-4 text-base sm:text-lg leading-relaxed"
            style="color: var(--fg-muted); max-width: var(--measure)"
          >
            {{ page.description }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-x-3 u-meta">
            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
            <template v-if="page.category">
              <span class="sep" aria-hidden="true">/</span>
              <NuxtLink
                :to="`/category/${page.category}`"
                class="cat inline-flex items-center min-h-11 -mx-2 px-2 cursor-pointer transition-colors duration-200"
              >
                {{ categoryName(page.category) }}
              </NuxtLink>
            </template>
          </div>

          <ul v-if="page.tags?.length" class="mt-4 flex flex-wrap gap-2">
            <li v-for="t in page.tags" :key="t">
              <NuxtLink
                :to="`/tag/${t}`"
                class="tag inline-flex items-center h-11 px-3 rounded-md border u-meta cursor-pointer transition-colors duration-200"
              >
                {{ t }}
              </NuxtLink>
            </li>
          </ul>
        </header>

        <hr class="u-rule mt-8" />

        <!-- 窄屏目录：折叠在正文上方 -->
        <details
          v-if="tocLinks.length"
          class="toc-panel lg:hidden mt-8 rounded-lg border u-surface"
          style="border-color: var(--border)"
        >
          <summary
            class="flex items-center justify-between gap-3 min-h-11 px-4 py-2 cursor-pointer select-none"
          >
            <span class="u-meta">目录</span>
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
              style="color: var(--fg-subtle)"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div class="px-2 pb-3">
            <ArticleToc :links="tocLinks" title="" />
          </div>
        </details>

        <!-- 正文：视觉主题全部由 main.css 的 .prose 提供 -->
        <div class="prose mt-8">
          <ContentRenderer :value="page" />
        </div>

        <!-- 上下篇 -->
        <nav v-if="prev || next" aria-label="上下篇导航" class="mt-16 u-rule-bold pt-4">
          <p class="u-kicker">Next</p>
          <h2 class="u-h3 mt-1">继续阅读</h2>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-if="prev"
              :to="prev.path"
              class="nav-card flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors duration-200"
              style="border-color: var(--border)"
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
              <span class="nav-title text-sm font-medium leading-snug line-clamp-2">
                {{ prev.title }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="next"
              :to="next.path"
              class="nav-card flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors duration-200 sm:items-end sm:text-right"
              :class="{ 'sm:col-start-2': !prev }"
              style="border-color: var(--border)"
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
              <span class="nav-title text-sm font-medium leading-snug line-clamp-2">
                {{ next.title }}
              </span>
            </NuxtLink>
          </div>
        </nav>
      </article>

      <!-- 宽屏目录：吸顶，超长时自身滚动 -->
      <aside v-if="tocLinks.length" class="hidden lg:block">
        <div
          class="sticky overflow-y-auto"
          style="
            top: calc(var(--header-h) + 1rem);
            max-height: calc(100vh - var(--header-h) - 3rem);
          "
        >
          <ArticleToc :links="tocLinks" />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.back {
  color: var(--fg-muted);
}
.back:hover {
  color: var(--accent-text);
}

.cat {
  color: var(--accent-text);
}
/* hover 提升到最高对比的 --fg，强调改由引文金下划线承担，避免 hover 反而更难读 */
.cat:hover {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 3px;
}

/* byline 分隔符：金色小点缀，区隔日期与分类 */
.sep {
  color: var(--accent);
}

.tag {
  color: var(--fg-muted);
  border-color: var(--border);
}
.tag:hover {
  color: var(--fg);
  background: var(--surface-2);
  border-color: var(--border-strong);
}

.nav-card {
  color: var(--fg-muted);
}
.nav-card:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
}
.nav-card:hover .nav-title {
  color: var(--accent-text);
}
.nav-title {
  color: var(--fg);
  transition: color 200ms ease-out;
}

/* 折叠面板：去掉默认三角，展开时箭头翻转 */
.toc-panel summary::-webkit-details-marker {
  display: none;
}
.toc-panel summary {
  list-style: none;
}
.chevron {
  transition: transform 200ms ease-out;
}
.toc-panel[open] .chevron {
  transform: rotate(180deg);
}
</style>
