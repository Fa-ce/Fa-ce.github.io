<template>
  <div class="min-h-screen flex flex-col" style="background: var(--bg); color: var(--fg)">
    <!-- 跳过导航：仅键盘聚焦时可见，避免每页 Tab 穿过整个页头 -->
    <a href="#main" class="skip-link">跳到主内容</a>
    <AppHeader />
    <main id="main" tabindex="-1" class="flex-1 w-full">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: 1rem;
  top: -100%;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 1rem;
  border-radius: 0.375rem;
  background: var(--fg);
  color: var(--bg);
  font-size: 0.875rem;
  transition: top 200ms ease-out;
}
.skip-link:focus-visible {
  top: 0.5rem;
}

#main:focus {
  outline: none;
}
</style>
