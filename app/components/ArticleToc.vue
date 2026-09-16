<script lang="ts">
/** 目录项，结构与 @nuxt/content 的 body.toc.links 一致（depth 2/3，最多两级） */
export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    links?: TocLink[]
    /** 传空串可隐藏标题，供外层已有标题（如折叠面板 summary）的场景复用 */
    title?: string
  }>(),
  { links: () => [], title: '目录' }
)

const activeId = ref('')

let observer: IntersectionObserver | null = null
let headings: HTMLElement[] = []
/** 并发保护：await 期间被新一轮 observe 抢占时，旧的一轮直接放弃，避免观察器泄漏 */
let runId = 0

const hasLinks = computed(() => props.links.length > 0)

/** 展平成文档顺序的 id 序列，用于定位当前章节 */
const ids = computed(() => props.links.flatMap(l => [l.id, ...(l.children?.map(c => c.id) ?? [])]))

/** 顶部安全线：全局 scroll-padding-top 已按页头高度设定，直接复用避免重复配置 */
function topLine(): number {
  const v = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
  return Number.isFinite(v) ? v : 0
}

/** 越过安全线的最后一个标题即当前章节；触底时强制落到末项，否则末尾短章节永远无法高亮 */
function updateActive() {
  const first = headings[0]
  if (!first) return
  const line = topLine() + 1
  let current = first.id
  for (const el of headings) {
    if (el.getBoundingClientRect().top > line) break
    current = el.id
  }
  const doc = document.documentElement
  const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2
  activeId.value = (atBottom && headings[headings.length - 1]?.id) || current
}

function disconnect() {
  observer?.disconnect()
  observer = null
  headings = []
}

/**
 * 把观察窗口收窄成安全线下方的一条窄带：标题穿过窄带才回调重算，
 * 滚动过程中零 scroll 监听开销。
 */
async function observe() {
  const run = ++runId
  disconnect()
  if (!ids.value.length) return
  // 正文由同级的 ContentRenderer 渲染，等一帧确保标题已在 DOM 中
  await nextTick()
  if (run !== runId) return
  headings = ids.value
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el)
  if (!headings.length) return

  const io = new IntersectionObserver(updateActive, {
    rootMargin: `-${topLine()}px 0px -70% 0px`,
    threshold: 0
  })
  for (const el of headings) io.observe(el)
  observer = io
  updateActive()
}

onMounted(observe)
// 递增 runId 一并作废「已卸载但仍挂起」的那一轮 observe
onBeforeUnmount(() => {
  runId++
  disconnect()
})
watch(ids, observe)

/** 接管锚点滚动：按安全线补偿偏移，并在 reduced-motion 下退化为瞬时跳转 */
function jump(e: MouseEvent, id: string) {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  activeId.value = id
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - topLine(),
    behavior: reduce ? 'auto' : 'smooth'
  })
  // 只改 hash 且保留 router 的 history.state，不新增历史记录
  history.replaceState(history.state, '', `#${id}`)
}
</script>

<template>
  <nav v-if="hasLinks" aria-label="文章目录" class="toc-panel u-rule-bold pt-3 px-3 pb-2">
    <p v-if="title" class="u-kicker">
      {{ title }}
    </p>

    <ul class="mt-3 border-l" style="border-color: var(--border)">
      <li v-for="link in links" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="toc-link flex items-center min-h-11 py-2 pl-3 pr-2 text-sm leading-snug break-words cursor-pointer"
          :aria-current="activeId === link.id ? 'location' : undefined"
          @click="jump($event, link.id)"
        >
          {{ link.text }}
        </a>

        <ul v-if="link.children?.length">
          <li v-for="child in link.children" :key="child.id">
            <a
              :href="`#${child.id}`"
              class="toc-link flex items-center min-h-11 py-2 pl-6 pr-2 text-xs leading-snug break-words cursor-pointer"
              :aria-current="activeId === child.id ? 'location' : undefined"
              @click="jump($event, child.id)"
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 弱底 + 2px primary 顶线，让目录在正文旁形成独立的「侧栏」体块 */
.toc-panel {
  background: var(--surface-2);
}

.toc-link {
  /* 负外边距让 2px 高亮竖条压住列表左侧的 1px 基线 */
  margin-left: -1px;
  border-left: 2px solid transparent;
  color: var(--fg-muted);
  transition:
    color 200ms ease-out,
    border-color 200ms ease-out,
    background-color 200ms ease-out;
}
/* 目录底色已是 --surface-2（与 --code-bg 同值），hover 改用中性混色才可见 */
.toc-link:hover {
  color: var(--fg);
  background: color-mix(in srgb, var(--fg) 6%, transparent);
}
/* 当前项抬到 --surface：金字在弱底上仅约 4.6:1，抬底后回到 5:1 以上 */
.toc-link[aria-current] {
  color: var(--accent-text);
  border-left-color: var(--accent);
  background: var(--surface);
  font-weight: 550;
}
</style>
