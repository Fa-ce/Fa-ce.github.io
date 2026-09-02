<script setup lang="ts">
const year = 2026
</script>

<template>
  <!-- 2px primary 顶线 + surface-2 弱底，与正文区拉开层次 -->
  <footer class="u-rule-bold mt-24" style="background: var(--surface-2)">
    <div
      class="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm"
      style="color: var(--fg-muted)"
    >
      <p class="u-mono">© {{ year }} Fa-ce</p>
      <nav>
        <ul class="flex items-center gap-6">
          <li>
            <NuxtLink to="/blog" class="u-underline cursor-pointer inline-flex min-h-11 items-center">博客</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/docs" class="u-underline cursor-pointer inline-flex min-h-11 items-center">文档</NuxtLink>
          </li>
          <li>
            <a
              href="https://github.com/Fa-ce"
              target="_blank"
              rel="noopener noreferrer"
              class="u-underline cursor-pointer inline-flex min-h-11 items-center"
            >GitHub</a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
