<script setup lang="ts">
/**
 * 博客列表页
 * 数据一次性取回，分类/标签筛选与分页全部在客户端对结果集做，切换不重新请求。
 * 筛选状态落在 URL query（category / tag / page），刷新与分享后可复原。
 */

const PAGE_SIZE = 8

const route = useRoute()

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .all()
)

useHead({ title: '博客 · Fa·ce' })

/** query 值可能是数组或 null，统一归一为字符串 */
function queryStr(v: unknown): string {
  return typeof v === 'string' ? v : Array.isArray(v) ? String(v[0] ?? '') : ''
}

const allPosts = computed(() => posts.value ?? [])
const activeCategory = computed(() => queryStr(route.query.category))
const activeTag = computed(() => queryStr(route.query.tag))
const hasFilter = computed(() => !!activeCategory.value || !!activeTag.value)

/* ---------------- 筛选 ---------------- */

const byCategory = computed(() =>
  activeCategory.value
    ? allPosts.value.filter(p => p.category === activeCategory.value)
    : allPosts.value
)

const filtered = computed(() =>
  activeTag.value
    ? byCategory.value.filter(p => p.tags?.includes(activeTag.value))
    : byCategory.value
)

/** 只列出实际有文章的分类，顺序沿用 taxonomy 定义，字典外的 slug 兜底排在最后 */
const categories = computed(() => {
  const count = new Map<string, number>()
  for (const p of allPosts.value) {
    if (p.category) count.set(p.category, (count.get(p.category) ?? 0) + 1)
  }
  const order = new Map(CATEGORIES.map((c, i) => [c.slug, i]))
  return [...count]
    .sort((a, b) => (order.get(a[0]) ?? Number.MAX_SAFE_INTEGER) - (order.get(b[0]) ?? Number.MAX_SAFE_INTEGER))
    .map(([slug, n]) => ({ slug, name: categoryName(slug), count: n }))
})

/**
 * 标签聚合自「分类过滤后」的集合：选中标签本身不再收窄标签列表，
 * 否则一旦选中就无法横向切换到其他标签。
 */
const tags = computed(() => {
  const count = new Map<string, number>()
  for (const p of byCategory.value) {
    for (const t of p.tags ?? []) count.set(t, (count.get(t) ?? 0) + 1)
  }
  return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})

/* ---------------- 分页 ---------------- */

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

/** 越界或非法页码一律钳制到有效区间，避免出现空白页 */
const page = computed(() => {
  const n = Number.parseInt(queryStr(route.query.page), 10)
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), totalPages.value) : 1
})

const pagePosts = computed(() =>
  filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
)

/** 页码序列：超过 7 页时固定首尾 + 当前页窗口，其余折叠为省略号 */
const pageItems = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const picked = new Set([1, total])
  for (let i = page.value - 1; i <= page.value + 1; i++) {
    if (i > 1 && i < total) picked.add(i)
  }
  const sorted = [...picked].sort((a, b) => a - b)
  return sorted.flatMap((n, i) => (i && n - (sorted[i - 1] ?? 0) > 1 ? ['…' as const, n] : [n]))
})

/* ---------------- URL 写入 ---------------- */

/** 合并补丁并剔除空值，保证 URL 不残留 ?category=&page=1 之类的噪声 */
function apply(patch: Record<string, string | number | undefined>) {
  const merged: Record<string, unknown> = { ...route.query, ...patch }
  const query: Record<string, string> = {}
  for (const [k, v] of Object.entries(merged)) {
    const s = typeof v === 'number' ? String(v) : queryStr(v)
    if (s) query[k] = s
  }
  navigateTo({ path: route.path, query })
}

function selectCategory(slug: string) {
  // 切换分类时，仅当已选标签在新分类下仍有结果才保留，否则丢弃，避免直接掉进空状态
  const base = slug ? allPosts.value.filter(p => p.category === slug) : allPosts.value
  const keepTag =
    activeTag.value && base.some(p => p.tags?.includes(activeTag.value)) ? activeTag.value : undefined
  apply({ category: slug || undefined, tag: keepTag, page: undefined })
}

/** 标签是开关：再次点击当前标签即取消 */
function toggleTag(tag: string) {
  apply({ tag: activeTag.value === tag ? undefined : tag, page: undefined })
}

function clearFilters() {
  apply({ category: undefined, tag: undefined, page: undefined })
}

/**
 * 头条大卡只在「首页第 1 页且无任何筛选」时出现：
 * 一旦进入筛选或翻页，结果集是用户主动收窄的，任何一篇被放大都会被误读为编辑推荐。
 */
const showFeatured = computed(() => !hasFilter.value && page.value === 1)

const listTop = ref<HTMLElement | null>(null)

function goPage(n: number) {
  if (n < 1 || n > totalPages.value || n === page.value) return
  apply({ page: n > 1 ? n : undefined })
  // 翻页后回到列表顶部；滚动行为交给全局 CSS，reduced-motion 下自动降级为瞬时
  nextTick(() => listTop.value?.scrollIntoView({ block: 'start' }))
}
</script>

<template>
  <!-- 页头：与下方容器平级，避免 PageHeader 自带的 max-w/px 与外层容器叠加缩进 -->
  <PageHeader
    kicker="Blog"
    title="博客"
    :meta="`共 ${allPosts.length} 篇文章`"
    :bordered="false"
  />

  <div class="mx-auto max-w-5xl px-4 sm:px-6 pb-4">
    <!-- 分类筛选 -->
    <nav aria-label="分类筛选" class="u-rule-bold border-b" style="border-bottom-color: var(--border)">
      <ul class="filter-scroll flex items-center gap-1 overflow-x-auto py-2">
        <li class="shrink-0">
          <button
            type="button"
            class="tab inline-flex items-center gap-2 h-11 px-3 rounded-md text-sm whitespace-nowrap cursor-pointer transition-colors duration-200"
            :aria-pressed="!activeCategory"
            @click="selectCategory('')"
          >
            全部
            <span class="count u-mono text-xs">{{ allPosts.length }}</span>
          </button>
        </li>
        <li v-for="c in categories" :key="c.slug" class="shrink-0">
          <button
            type="button"
            class="tab inline-flex items-center gap-2 h-11 px-3 rounded-md text-sm whitespace-nowrap cursor-pointer transition-colors duration-200"
            :aria-pressed="activeCategory === c.slug"
            @click="selectCategory(c.slug)"
          >
            {{ c.name }}
            <span class="count u-mono text-xs">{{ c.count }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- 标签筛选 -->
    <section
      v-if="tags.length"
      aria-labelledby="tag-filter-heading"
      class="py-5 border-b"
      style="border-color: var(--border)"
    >
      <h2 id="tag-filter-heading" class="u-kicker">
        标签
      </h2>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li v-for="[tag, n] in tags" :key="tag">
          <button
            type="button"
            class="tag inline-flex items-center gap-1.5 h-11 px-3 rounded-md border text-xs u-mono cursor-pointer transition-colors duration-200"
            :aria-pressed="activeTag === tag"
            @click="toggleTag(tag)"
          >
            {{ tag }}
            <span class="count">{{ n }}</span>
            <svg
              v-if="activeTag === tag"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </section>

    <!-- 结果概览 + 清除入口 -->
    <div v-if="hasFilter && filtered.length" class="flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
      <p class="u-meta">
        筛选出 {{ filtered.length }} 篇<template v-if="totalPages > 1">
          · 第 {{ page }} / {{ totalPages }} 页</template>
      </p>
      <button
        type="button"
        class="btn inline-flex items-center gap-1.5 h-11 px-3 rounded-md border text-sm cursor-pointer transition-colors duration-200"
        @click="clearFilters"
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
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        清除筛选
      </button>
    </div>

    <!-- 列表：无筛选的第 1 页用头条大卡开场，形成一大多小的主次结构 -->
    <section v-if="pagePosts.length" ref="listTop" aria-labelledby="post-list-heading" class="pt-8">
      <div class="u-rule-bold pt-4 pb-5">
        <p class="u-kicker">{{ hasFilter ? 'Results' : 'Latest' }}</p>
        <h2 id="post-list-heading" class="u-h2 mt-2">
          {{ hasFilter ? '筛选结果' : '最新文章' }}
        </h2>
      </div>

      <PostCard
        v-for="(p, i) in pagePosts"
        :key="p.path"
        :path="p.path"
        :title="p.title"
        :description="p.description"
        :date="p.date"
        :category="p.category"
        :tags="p.tags"
        :featured="showFeatured && i === 0"
      />
    </section>

    <!-- 空状态 -->
    <EmptyState
      v-else-if="hasFilter"
      title="没有符合条件的文章"
      description="试试换一个分类或标签"
      icon="search"
    >
      <template #action>
        <button
          type="button"
          class="btn inline-flex items-center gap-2 h-11 px-4 rounded-md border text-sm cursor-pointer transition-colors duration-200"
          @click="clearFilters"
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
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          清除全部筛选
        </button>
      </template>
    </EmptyState>
    <EmptyState v-else title="暂无文章" icon="inbox" />

    <!-- 分页：只有一页时整体隐藏 -->
    <nav
      v-if="totalPages > 1"
      aria-label="分页"
      class="pt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        class="btn inline-flex items-center justify-center gap-1 min-w-11 h-11 px-3 rounded-md border text-sm cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page <= 1"
        aria-label="上一页"
        @click="goPage(page - 1)"
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
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span class="hidden sm:inline">上一页</span>
      </button>

      <ul class="flex items-center gap-1">
        <li v-for="(item, i) in pageItems" :key="i">
          <span
            v-if="item === '…'"
            class="inline-flex items-center justify-center w-11 h-11 u-mono text-sm"
            style="color: var(--fg-subtle)"
            aria-hidden="true"
          >…</span>
          <button
            v-else
            type="button"
            class="btn inline-flex items-center justify-center w-11 h-11 rounded-md border text-sm u-mono cursor-pointer transition-colors duration-200"
            :aria-current="item === page ? 'page' : undefined"
            :aria-label="`第 ${item} 页`"
            @click="goPage(item)"
          >
            {{ item }}
          </button>
        </li>
      </ul>

      <button
        type="button"
        class="btn inline-flex items-center justify-center gap-1 min-w-11 h-11 px-3 rounded-md border text-sm cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page >= totalPages"
        aria-label="下一页"
        @click="goPage(page + 1)"
      >
        <span class="hidden sm:inline">下一页</span>
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<style scoped>
/* 分类：选中态用 primary 实底 + on-primary 字，把品牌色放到最显眼的状态上 */
.tab {
  color: var(--fg-muted);
}
.tab:hover {
  color: var(--fg);
  background: var(--surface-2);
}
.tab[aria-pressed='true'] {
  background: var(--primary);
  color: var(--on-primary);
  font-weight: 550;
}

/* 标签：选中态走强调色描边 + 弱底，内描边把金色边视觉加粗到 2px */
.tag {
  color: var(--fg-muted);
  border-color: var(--border);
}
.tag:hover {
  color: var(--fg);
  background: var(--surface-2);
  border-color: var(--border-strong);
}
.tag[aria-pressed='true'] {
  color: var(--accent-text);
  background: var(--accent-soft);
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}

/* 计数是有效信息而非装饰：常态用达标的 --fg-subtle，选中态底色变化后改为继承前景色 */
.count {
  color: var(--fg-subtle);
}
.tab[aria-pressed='true'] .count,
.tag[aria-pressed='true'] .count {
  color: inherit;
}

/* 分页 / 清除按钮 */
.btn {
  color: var(--fg-muted);
  border-color: var(--border);
}
.btn:hover:not(:disabled) {
  color: var(--fg);
  background: var(--surface-2);
  border-color: var(--border-strong);
}
/* hover 规则带 :not() 特异性更高，当前页必须连 :hover 一起声明才不会被覆盖掉色 */
.btn[aria-current],
.btn[aria-current]:hover {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
  font-weight: 550;
}

/*
  窄屏横向滚动提示：内容溢出时两端浮出渐隐阴影，滚到端点自动消失。
  原理是 local 附着的底色遮罩随内容滚动，盖住 scroll 附着的固定阴影，纯 CSS 无需 JS 测量。
*/
.filter-scroll {
  background:
    linear-gradient(to right, var(--bg) 40%, transparent) 0 0 / 32px 100% no-repeat local,
    linear-gradient(to left, var(--bg) 40%, transparent) 100% 0 / 32px 100% no-repeat local,
    linear-gradient(to right, color-mix(in srgb, var(--fg) 14%, transparent), transparent) 0 0 /
      16px 100% no-repeat scroll,
    linear-gradient(to left, color-mix(in srgb, var(--fg) 14%, transparent), transparent) 100% 0 /
      16px 100% no-repeat scroll;
}
</style>
