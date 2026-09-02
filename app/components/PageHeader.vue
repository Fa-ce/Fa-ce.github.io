<script setup lang="ts">
/**
 * 站内统一的页面头部。列表类页面一律使用本组件，
 * 以免各页在 padding / 字号 / 计数行样式上各写一套。
 * 首页 Hero 属于特殊版式，不使用本组件。
 */
interface Props {
  title: string
  /** 计数或元信息，等宽字体呈现，如「共 7 篇文章」 */
  meta?: string
  description?: string
  /** 栏目标记，有值时在标题上方渲染「粗线 + 大写等宽小字」 */
  kicker?: string
  /** 是否显示底部分隔线，默认显示 */
  bordered?: boolean
}
withDefaults(defineProps<Props>(), { bordered: true })
</script>

<template>
  <header
    class="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-14 pb-6"
    :class="bordered && 'border-b'"
    style="border-color: var(--border)"
  >
    <p v-if="kicker" class="u-kicker u-rule-bold pt-3 mb-4">{{ kicker }}</p>

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <h1 class="u-h1">
          <slot name="title">{{ title }}</slot>
        </h1>
        <p v-if="meta" class="mt-3 u-meta">
          {{ meta }}
        </p>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <p
      v-if="description"
      class="mt-4 text-sm leading-relaxed max-w-2xl"
      style="color: var(--fg-muted)"
    >
      {{ description }}
    </p>
  </header>
</template>
