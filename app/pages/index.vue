<script setup lang="ts">
useHead({
  title: 'Fa-ce | 技术博客与知识库'
})

// 获取最新 5 篇 blog
const { data: recentPosts } = await useAsyncData('home-recent-blog', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'category', 'tags')
    .limit(5)
    .all()
)

// 展示层拆分：首篇作头条大卡，其余进右侧窄栏
const leadPost = computed(() => recentPosts.value?.[0])
const restPosts = computed(() => recentPosts.value?.slice(1) ?? [])
</script>

<template>
  <div>
    <!-- Hero 区：整块铺 surface 底，与下方 bg 底的内容区拉开版块层次 -->
    <section style="background: var(--surface); border-bottom: 1px solid var(--border)">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-14 sm:pt-24 sm:pb-20">
        <!-- 站点名称（栏目标记） -->
        <p class="u-kicker">
          Fa<span style="color: var(--accent)">·</span>ce Studio
        </p>

        <!-- Hero 标题：关键词着金，编辑风的大面积强调手法 -->
        <h1 class="u-hero mt-6 sm:mt-8">
          技术博客<br />与<span style="color: var(--accent-text)">知识库</span>
        </h1>

        <!-- 一句话定位 -->
        <p class="mt-7 sm:mt-9 text-lg sm:text-xl leading-relaxed max-w-2xl" style="color: var(--fg-muted)">
          专注前端架构、工程化与深度知识总结。记录学习路上的洞察与实践。
        </p>

        <!-- CTA 按钮 -->
        <div class="mt-9 sm:mt-11 flex flex-wrap gap-3">
          <NuxtLink
            to="/blog"
            class="cta-primary inline-flex items-center h-11 px-5 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer"
            style="background: var(--primary); color: var(--on-primary)"
          >
            开始阅读
          </NuxtLink>
          <NuxtLink
            to="/archive"
            class="cta-secondary inline-flex items-center h-11 px-5 rounded-lg font-medium text-sm border transition-colors duration-200 cursor-pointer"
            style="border-color: var(--border); color: var(--fg)"
          >
            查看归档
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 最新文章区 -->
    <section
      class="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16"
      style="border-bottom: 1px solid var(--border)"
    >
      <!-- 栏目头：粗线 + 栏目标记 + 标题 -->
      <header class="u-rule-bold pt-5">
        <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p class="u-kicker">01 / Latest</p>
            <h2 class="u-h2 mt-2">最新文章</h2>
            <p class="u-meta mt-2">来自博客的最新更新</p>
          </div>
          <!-- 查看全部入口：min-h-11 保证触摸目标，负 margin 抵消视觉留白 -->
          <NuxtLink
            to="/blog"
            class="view-all inline-flex items-center gap-1.5 min-h-11 -my-2 u-meta transition-colors duration-200 cursor-pointer"
          >
            查看全部
            <svg
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
          </NuxtLink>
        </div>
      </header>

      <!-- 非对称网格：头条 7 列 + 次要 5 列，lg 以下回落单列 -->
      <div v-if="leadPost" class="mt-8 grid gap-y-4 lg:grid-cols-12 lg:gap-x-10">
        <div class="lg:col-span-7">
          <PostCard
            :path="leadPost.path"
            :title="leadPost.title"
            :description="leadPost.description"
            :date="leadPost.date"
            :category="leadPost.category"
            :tags="leadPost.tags"
            :featured="true"
          />
        </div>
        <div
          v-if="restPosts.length"
          class="lg:col-span-5 lg:border-l lg:pl-10"
          style="border-color: var(--border)"
        >
          <PostCard
            v-for="post in restPosts"
            :key="post.path"
            :path="post.path"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :category="post.category"
            :tags="post.tags"
            compact
          />
        </div>
      </div>
      <div v-else class="mt-8 py-8 text-center u-muted">
        暂无文章
      </div>
    </section>

    <!-- 分类导航区 -->
    <section
      class="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16"
      style="border-bottom: 1px solid var(--border)"
    >
      <header class="u-rule-bold pt-5">
        <p class="u-kicker">02 / Categories</p>
        <h2 class="u-h2 mt-2">知识分类</h2>
        <p class="u-meta mt-2">按主题浏览文章和文档</p>
      </header>

      <!-- 非对称：首个分类占 6/12 大格，其余 3/12 四联排 -->
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        <CategoryCard
          v-for="(cat, i) in CATEGORIES"
          :key="cat.slug"
          :slug="cat.slug"
          :name="cat.name"
          :desc="cat.desc"
          :class="i === 0 ? 'cat-feature sm:col-span-2 lg:col-span-6' : 'lg:col-span-3'"
        />
      </div>
    </section>

    <!-- 文档入口区 -->
    <section class="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <header class="u-rule-bold pt-5">
        <p class="u-kicker">03 / Library</p>
        <h2 class="u-h2 mt-2">知识库文档</h2>
      </header>

      <!-- 8:4 不等分：正文占 8 列，CTA 靠右占 4 列；顶部 navy 粗线强化版块归属 -->
      <div
        class="mt-8 p-8 sm:p-10 rounded-lg grid gap-6 lg:grid-cols-12 lg:items-center"
        style="background: var(--surface); border: 1px solid var(--border); border-top: 3px solid var(--primary)"
      >
        <p class="lg:col-span-8 leading-relaxed" style="color: var(--fg-muted)">
          系统整理的技术文档与学习笔记，涵盖前端开发、框架深度、工程实践等多个领域。
        </p>
        <div class="lg:col-span-4 lg:justify-self-end">
          <NuxtLink
            to="/docs"
            class="cta-primary inline-flex items-center h-11 px-5 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer"
            style="background: var(--primary); color: var(--on-primary)"
          >
            浏览所有文档
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 主 CTA：primary 实底 + on-primary 文字，accent 仅作 hover 描边装饰 */
.cta-primary {
  box-shadow: inset 0 0 0 2px transparent;
}
.cta-primary:hover {
  box-shadow: inset 0 0 0 2px var(--accent);
}

/* 次 CTA：hover 走弱底 + 强描边（原 hover:u-surface 不生成 CSS） */
.cta-secondary:hover {
  background: var(--code-bg);
  border-color: var(--border-strong);
}

/*
  分类首格差异化：CategoryCard 的底色写在内联 style 上，外部类选择器压不过，
  故改为重映射它取用的 --surface；金色左边条呼应非对称布局的主次关系。
*/
.cat-feature {
  --surface: var(--accent-soft);
  box-shadow: inset 4px 0 0 var(--accent);
}

.view-all {
  color: var(--fg-muted);
}
.view-all:hover {
  color: var(--accent-text);
}
</style>
