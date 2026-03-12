import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },       // 原有路由
    { path: "/system", component: "system" }, // 新增路由"}
    { path: "signup", component: "signup" },
    { path: "/system_teacher", component: "system_teacher"},
    { path: "/system_student", component: "system_student"}
  ],
  npmClient: 'pnpm',
  proxy:{
    '/api':{
      target:'http://localhost:3001',
      changeOrigin:true,
      pathRewrite:{
        '^/api':'/api'
      },
    },
  },
});