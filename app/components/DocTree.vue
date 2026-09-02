<script setup lang="ts">
/**
 * 文档章节树
 * docs 是扁平结构（content/docs/ 下无子目录），所以两级导航靠 category 字段分组得到。
 * 折叠状态存在组件内部：路由切换只保证「当前文档所在组」展开，不回收用户手动展开的其他组。
 */

interface DocItem {
  path: string
  title: string
  category?: string
}

interface Props {
  items?: DocItem[]
  currentPath?: string
}

const props = defineProps<Props>()

interface Group {
  slug: string
  name: string
  items: DocItem[]
}

/** 分组顺序沿用 taxonomy 定义，字典外的 slug 兜底排在最后 */
const groups = computed<Group[]>(() => {
  const map = new Map<string, DocItem[]>()
  for (const it of props.items ?? []) {
    const slug = it.category || 'uncategorized'
    const bucket = map.get(slug)
    if (bucket) bucket.push(it)
    else map.set(slug, [it])
  }
  const order = new Map(CATEGORIES.map((c, i) => [c.slug, i]))
  return [...map]
    .sort(
      (a, b) =>
        (order.get(a[0]) ?? Number.MAX_SAFE_INTEGER) - (order.get(b[0]) ?? Number.MAX_SAFE_INTEGER)
    )
    .map(([slug, items]) => ({ slug, name: categoryName(slug) || '未分类', items }))
})

const currentGroup = computed(
  () => groups.value.find(g => g.items.some(i => i.path === props.currentPath))?.slug
)

const opened = reactive(new Set<string>())

// 当前组始终展开；没有命中任何文档时（如在索引页复用）默认全部展开
watch(
  [currentGroup, groups],
  ([slug, list]) => {
    if (slug) opened.add(slug)
    else for (const g of list) opened.add(g.slug)
  },
  { immediate: true }
)

/** 把用户手动的展开/收起同步回内部状态，避免下次重渲染被覆盖 */
function onToggle(slug: string, e: Event) {
  if ((e.target as HTMLDetailsElement).open) opened.add(slug)
  else opened.delete(slug)
}
</script>

<template>
  <nav aria-label="文档章节" class="text-sm">
    <template v-if="groups.length">
      <details
        v-for="g in groups"
        :key="g.slug"
        :open="opened.has(g.slug)"
        class="tree-group border-b"
        style="border-color: var(--border)"
        @toggle="onToggle(g.slug, $event)"
      >
        <summary class="tree-summary flex items-center gap-2 min-h-11 py-2 pr-2 cursor-pointer">
          <svg
            class="chevron shrink-0"
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
          <span class="flex-1 font-medium">{{ g.name }}</span>
          <span class="u-mono text-xs" style="color: var(--fg-subtle)">{{ g.items.length }}</span>
        </summary>

        <ul class="pb-2">
          <li v-for="d in g.items" :key="d.path">
            <NuxtLink
              :to="d.path"
              class="tree-link flex items-center min-h-11 min-w-0 py-2 pl-3 pr-2 leading-snug break-words cursor-pointer transition-colors duration-200"
              :aria-current="d.path === currentPath ? 'page' : undefined"
            >
              {{ d.title }}
            </NuxtLink>
          </li>
        </ul>
      </details>
    </template>

    <!-- 空状态 -->
    <p v-else class="py-6 u-mono text-xs" style="color: var(--fg-subtle)">暂无文档</p>
  </nav>
</template>

<style scoped>
.tree-group:last-of-type {
  border-bottom: 0;
}

/* 去掉浏览器默认三角，改用自绘 chevron */
.tree-summary {
  list-style: none;
  color: var(--fg);
  transition: color 200ms ease;
}
.tree-summary::-webkit-details-marker {
  display: none;
}
.tree-summary::marker {
  content: '';
}
.tree-summary:hover {
  color: var(--accent-text);
}

.chevron {
  color: var(--fg-subtle);
  transition: transform 200ms ease;
}
details[open] > .tree-summary .chevron {
  transform: rotate(90deg);
}

/* 竖条常驻但透明，避免高亮时产生 2px 的横向抖动 */
.tree-link {
  color: var(--fg-muted);
  border-left: 2px solid transparent;
}
.tree-link:hover {
  color: var(--fg);
  background: var(--code-bg);
  border-left-color: var(--border-strong);
}
.tree-link[aria-current='page'] {
  color: var(--accent-text);
  background: var(--accent-soft);
  border-left-color: var(--accent);
  font-weight: 550;
}
</style>
