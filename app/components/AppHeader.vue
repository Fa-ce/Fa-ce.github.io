<script setup lang="ts">
const { theme, toggle } = useTheme()

const NAV = [
  { to: '/blog', label: '博客' },
  { to: '/docs', label: '文档' },
  { to: '/archive', label: '归档' },
  { to: '/category', label: '分类' }
]
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b backdrop-blur"
    style="border-color: var(--border); background: color-mix(in srgb, var(--bg) 88%, transparent); height: var(--header-h)"
  >
    <div class="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center gap-4">
      <NuxtLink
        to="/"
        class="u-mono font-semibold tracking-tight text-[0.95rem] shrink-0 inline-flex items-center min-h-11"
        style="color: var(--fg)"
      >
        Fa<span style="color: var(--accent)">·</span>ce
      </NuxtLink>

      <nav class="flex-1 min-w-0">
        <ul class="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <li v-for="item in NAV" :key="item.to" class="shrink-0">
            <NuxtLink
              :to="item.to"
              class="inline-flex items-center h-11 px-2.5 sm:px-3 text-sm rounded-md transition-colors duration-200 cursor-pointer nav-link"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="theme-toggle inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-md border transition-colors duration-200 cursor-pointer"
        aria-label="深色模式"
        :aria-pressed="theme === 'dark'"
        @click="toggle"
      >
        <svg
          class="icon-sun"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          class="icon-moon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* 图标显隐由 <html class="dark"> 决定而非 JS 状态：
   SSR 阶段拿不到真实主题，用 v-if 会让暗色用户在 hydration 前看到反向图标 */
.icon-sun {
  display: none;
}
.dark .icon-sun {
  display: block;
}
.dark .icon-moon {
  display: none;
}

.nav-link {
  position: relative;
  color: var(--fg-muted);
}
.nav-link:hover {
  color: var(--fg);
  background: var(--surface-2);
}
/* 限定 .nav-link，避免首页时 logo 链接也被判定为当前项而带上指示线 */
.nav-link.router-link-active {
  color: var(--accent-text);
  font-weight: 550;
}
/* 指示线走 ::after 绝对定位：不参与布局，不撑高 44px 触摸目标 */
.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.375rem;
  height: 2px;
  border-radius: 1px;
  background: var(--accent);
}

.theme-toggle {
  border-color: var(--border);
}
.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--surface-2);
}
</style>
