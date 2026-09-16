<script setup lang="ts">
/**
 * 分类卡片。首页与分类总览页此前各写了一份近重复实现，统一由本组件承担。
 * count 为 undefined 时不显示计数（首页用法）。
 */
interface Props {
  slug: string
  name: string
  desc?: string
  count?: number
}
defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="`/category/${slug}`"
    class="cat-card block p-6 rounded-lg border transition-colors duration-200 cursor-pointer"
    style="border-color: var(--border); background: var(--surface)"
  >
    <div class="flex items-baseline justify-between gap-3">
      <h2 class="cat-name u-h3 transition-colors duration-200">
        {{ name }}
      </h2>
      <span v-if="count !== undefined" class="shrink-0 u-meta">
        {{ count > 0 ? `${count} 篇` : '暂无文章' }}
      </span>
    </div>
    <p v-if="desc" class="mt-2 text-sm leading-relaxed" style="color: var(--fg-muted)">
      {{ desc }}
    </p>
  </NuxtLink>
</template>

<style scoped>
.cat-card:hover {
  border-color: var(--border-strong);
}
.cat-card:hover .cat-name {
  color: var(--accent-text);
}
</style>
