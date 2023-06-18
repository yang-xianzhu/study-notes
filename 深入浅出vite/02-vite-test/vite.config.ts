import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// .env.development
// NODE_ENV = development;

// .env.production
// NODE_ENV = production;

// 是否为生产环境，在生产环境一般会注入 NODE_ENV 这个环境变量，
// const isProduction = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  // 部署域名基地址
  // base:''
  plugins: [react()],
});
