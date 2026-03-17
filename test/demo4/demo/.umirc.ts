import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },      
    { path: "/system", component: "system" }, 
    { path: "signup", component: "signup" },
    { path: "/system/teacher", component: "system_teacher"},
    { path: "/system/student", component: "system_student"},
    { path: "/game", component: "game" }
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