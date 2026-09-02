import taxonomy from '~/data/taxonomy.json'

export interface Category {
  slug: string
  name: string
  desc: string
  channel: string
}

export const CATEGORIES: Category[] = taxonomy.categories as Category[]

const BY_SLUG = new Map(CATEGORIES.map(c => [c.slug, c]))

/** 分类 slug → 中文名，未知 slug 原样返回，避免页面出现空白 */
export function categoryName(slug?: string): string {
  return (slug && BY_SLUG.get(slug)?.name) || slug || ''
}

export function categoryOf(slug?: string): Category | undefined {
  return slug ? BY_SLUG.get(slug) : undefined
}

/** 2026-07-30 → 2026年7月30日 */
export function formatDate(d?: string): string {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  if (!y || !m || !day) return d
  return `${y}年${Number(m)}月${Number(day)}日`
}
