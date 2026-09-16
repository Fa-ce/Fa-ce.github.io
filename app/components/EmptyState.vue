<script setup lang="ts">
/**
 * 站内统一的空状态。此前各页存在完整版/裸文本版/迷你版三套写法，
 * 统一由本组件承担，通过 size 区分密度。
 */
interface Props {
  title: string
  description?: string
  /** search 用于「筛选无结果」，inbox 用于「本来就没有内容」 */
  icon?: 'search' | 'inbox' | 'none'
  size?: 'default' | 'compact'
}
withDefaults(defineProps<Props>(), { icon: 'inbox', size: 'default' })
</script>

<template>
  <div class="text-center" :class="size === 'compact' ? 'py-6' : 'py-20'" role="status">
    <svg
      v-if="icon === 'search'"
      xmlns="http://www.w3.org/2000/svg"
      :width="size === 'compact' ? 20 : 32"
      :height="size === 'compact' ? 20 : 32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mx-auto mb-4"
      style="color: var(--accent)"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M13.5 8.5l-5 5M8.5 8.5l5 5" />
    </svg>
    <svg
      v-else-if="icon === 'inbox'"
      xmlns="http://www.w3.org/2000/svg"
      :width="size === 'compact' ? 20 : 32"
      :height="size === 'compact' ? 20 : 32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mx-auto mb-4"
      style="color: var(--accent)"
      aria-hidden="true"
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path
        d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
      />
    </svg>

    <p :class="size === 'compact' ? 'text-xs u-mono' : 'text-base font-medium'">
      {{ title }}
    </p>
    <p v-if="description && size !== 'compact'" class="mt-2 text-sm" style="color: var(--fg-muted)">
      {{ description }}
    </p>

    <div v-if="$slots.action && size !== 'compact'" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
