<script setup lang="ts">
useHead({
  title: '归档 | Fa-ce'
})

interface ArchiveItem {
  path: string
  title: string
  date?: string
  category?: string
  source: 'blog' | 'docs'
}

interface MonthGroup {
  month: string
  items: ArchiveItem[]
}

interface YearGroup {
  year: string
  months: MonthGroup[]
}

// 获取所有 blog 和 docs
const { data: blogPosts } = await useAsyncData('archive-blog', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .select('path', 'title', 'date', 'category')
    .all()
)

const { data: docPosts } = await useAsyncData('archive-docs', () =>
  queryCollection('docs')
    .where('draft', '=', false)
    .select('path', 'title', 'date', 'category')
    .all()
)

// 合并并分组
const groupedData = computed(() => {
  const items: ArchiveItem[] = []

  // 收集所有有效的条目（必须有 date）
  if (blogPosts.value) {
    blogPosts.value.forEach(p => {
      if (p.date) {
        items.push({
          path: p.path,
          title: p.title,
          date: p.date,
          category: p.category,
          source: 'blog'
        })
      }
    })
  }

  if (docPosts.value) {
    docPosts.value.forEach(p => {
      if (p.date) {
        items.push({
          path: p.path,
          title: p.title,
          date: p.date,
          category: p.category,
          source: 'docs'
        })
      }
    })
  }

  // 按 date 倒序排列
  items.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  // 按年月分组
  const yearMap = new Map<string, Map<string, ArchiveItem[]>>()
  items.forEach(item => {
    const [year, month] = (item.date || '').split('-')
    if (!year || !month) return

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map())
    }
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    monthMap.get(month)!.push(item)
  })

  // 转换为数组格式，年份倒序，月份倒序
  const years: YearGroup[] = []
  Array.from(yearMap.keys())
    .sort()
    .reverse()
    .forEach(year => {
      const monthMap = yearMap.get(year)!
      const months: MonthGroup[] = []
      Array.from(monthMap.keys())
        .sort()
        .reverse()
        .forEach(month => {
          months.push({
            month,
            items: monthMap.get(month)!
          })
        })
      years.push({
        year,
        months
      })
    })

  return { years, totalCount: items.length }
})
</script>

<template>
  <div>
    <!-- 页头 -->
    <PageHeader title="归档" :meta="`共 ${groupedData.totalCount} 篇 · 按时间倒序排列`" />

    <!-- 时间线内容 -->
    <section class="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div v-if="groupedData.years.length > 0" class="space-y-14">
        <!-- 按年份循环 -->
        <article v-for="yearGroup in groupedData.years" :key="yearGroup.year">
          <!-- 年份标题：粗线 + navy 年份，与 u-rule-bold 同色形成时间线强节奏 -->
          <h2 class="u-h2 u-mono u-rule-bold pt-4" style="color: var(--primary)">
            {{ yearGroup.year }}
          </h2>

          <!-- 按月份循环 -->
          <div class="mt-8 space-y-10 pl-0 sm:pl-8">
            <div
              v-for="monthGroup in yearGroup.months"
              :key="`${yearGroup.year}-${monthGroup.month}`"
            >
              <!-- 月份副标题（栏目标记） -->
              <h3 class="u-kicker mb-4 pb-3" style="border-bottom: 1px solid var(--border)">
                {{ Number(monthGroup.month) }}月
              </h3>

              <!-- 该月条目列表：日期窄列固定 + 标题列自适应 + 元信息靠右 -->
              <ul class="space-y-2 sm:space-y-1">
                <li
                  v-for="item in monthGroup.items"
                  :key="item.path"
                  class="archive-row grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)_auto] gap-x-4 sm:gap-x-6 -mx-3 px-3 rounded-md"
                >
                  <!-- 条目日期 -->
                  <div class="u-meta flex items-center">{{ item.date?.split('-')[2] }}日</div>

                  <!-- 条目标题（外层 div 保证链接宽度贴合文字，下划线不横贯整列） -->
                  <div class="min-w-0">
                    <NuxtLink
                      :to="item.path"
                      class="u-underline cursor-pointer inline-flex items-center min-h-11"
                      style="font-weight: 500"
                    >
                      {{ item.title }}
                    </NuxtLink>
                  </div>

                  <!-- byline：分类 · 来源 -->
                  <div
                    class="u-meta col-start-2 sm:col-start-3 flex items-center gap-1.5 pb-2 sm:pb-0"
                  >
                    <span v-if="item.category" style="color: var(--accent-text)">
                      {{ categoryName(item.category) }}
                    </span>
                    <span v-if="item.category">·</span>
                    <span>{{ item.source === 'blog' ? '博客' : '文档' }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <EmptyState v-else title="暂无内容" icon="inbox" />
    </section>
  </div>
</template>

<style scoped>
/* 整行 hover 反馈：u-* 是普通类不支持变体前缀，用具名 class + 真实伪类 */
.archive-row {
  transition: background-color 200ms ease-out;
}
.archive-row:hover {
  background: var(--surface-2);
}
</style>
