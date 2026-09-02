// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	modules: ["@nuxt/content"],
	devtools: { enabled: true },
	compatibilityDate: "2026-07-29",

	devServer: {
		port: 8080,
	},

	// Tailwind v4 走 Vite 插件接入，不再需要 tailwind.config.js
	css: ["~/assets/css/main.css"],
	vite: { plugins: [tailwindcss()] },

	// GitHub Pages 用户站点（fa-ce.github.io）部署在根路径，无需设置 baseURL。
	// 若改用项目站点（如 fa-ce.github.io/blog），需取消下面一行的注释并改成对应仓库名。
	// app: { baseURL: '/<repo-name>/' },

	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/", "/blog", "/docs"],
		},
	},

	content: {
		// Node 24 内置 node:sqlite，走原生连接器可免掉 better-sqlite3 这个 native 依赖，
		// CI 构建无需编译。若 Node < 22.5 或该实验选项失效，改为安装 better-sqlite3 即可。
		experimental: { nativeSqlite: true },
		build: {
			markdown: {
				toc: { depth: 3, searchDepth: 3 },
				highlight: {
					theme: { default: "github-light", dark: "github-dark" },
				},
			},
		},
	},
});
