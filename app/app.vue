<script setup lang="ts">
// 在 CSS 加载前同步决定主题，避免暗色模式首屏白闪
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  script: [
    {
      innerHTML: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
      tagPriority: 'critical'
    }
  ],
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
