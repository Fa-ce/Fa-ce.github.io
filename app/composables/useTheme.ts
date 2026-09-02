type Theme = 'light' | 'dark'

/** 全站主题状态。变量切换由 <html class="dark"> 驱动，见 assets/css/main.css */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  const apply = (v: Theme) => {
    document.documentElement.classList.toggle('dark', v === 'dark')
    try {
      localStorage.setItem('theme', v)
    } catch {
      // 隐私模式下 localStorage 不可写，仅本次会话生效
    }
  }

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    apply(theme.value)
  }

  onMounted(() => {
    // 与 app.vue 里的防闪烁脚本保持一致的判定顺序
    theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  return { theme, toggle }
}
