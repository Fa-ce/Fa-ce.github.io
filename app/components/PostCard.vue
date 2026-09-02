<script setup lang="ts">
interface Props {
  path: string
  title: string
  description?: string
  date?: string
  category?: string
  tags?: string[]
  /** 紧凑模式用于侧栏/相关列表，省略描述与标签 */
  compact?: boolean
  /** 头条模式：标题升一级、强制显示描述、上下留白加大 */
  featured?: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <article class="border-b" :class="featured ? 'py-10 sm:py-12' : 'py-6'" style="border-color: var(--border)">
    <!-- byline：等宽小字 + 「·」分隔，模拟报头元信息 -->
    <div class="flex items-baseline flex-wrap gap-x-2 mb-2 u-meta">
      <time v-if="date" :datetime="date">{{ formatDate(date) }}</time>
      <span v-if="date && category" aria-hidden="true">·</span>
      <NuxtLink
        v-if="category"
        :to="`/category/${category}`"
        class="cat-link inline-flex items-center min-h-11 -my-3.5 cursor-pointer"
      >
        {{ categoryName(category) }}
      </NuxtLink>
    </div>

    <h3 :class="featured ? 'u-h2' : 'u-h3'">
      <NuxtLink :to="path" class="u-underline cursor-pointer">
        {{ title }}
      </NuxtLink>
    </h3>

    <p
      v-if="description && (featured || !compact)"
      class="mt-2 text-sm leading-relaxed"
      :class="featured ? 'line-clamp-3 max-w-2xl' : 'line-clamp-2'"
      style="color: var(--fg-muted)"
    >
      {{ description }}
    </p>

    <ul v-if="tags?.length && !compact" class="mt-3 flex flex-wrap gap-2">
      <li v-for="t in tags.slice(0, 4)" :key="t">
        <NuxtLink
          :to="`/tag/${t}`"
          class="tag-pill inline-flex items-center h-7 px-2.5 rounded text-xs u-mono border cursor-pointer transition-colors duration-200"
          style="border-color: var(--border); color: var(--fg-muted)"
        >
          {{ t }}
        </NuxtLink>
      </li>
    </ul>
  </article>
</template>

<style scoped>
/* u-* 是普通 CSS 类不支持变体前缀，hover 态用具名 class + 真实伪类实现 */
.cat-link {
  color: var(--accent-text);
  transition: color 200ms ease-out;
}
.cat-link:hover {
  color: var(--fg);
}

.tag-pill {
  position: relative;
}
/* 视觉保持 28px 纤细，用伪元素把可点击区域扩到 44px 满足触摸目标 */
.tag-pill::after {
  content: '';
  position: absolute;
  inset: -8px 0;
}
.tag-pill:hover {
  color: var(--fg);
  background: var(--code-bg);
  border-color: var(--border-strong);
}
</style>
