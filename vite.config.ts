import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
//按需引入的插件（即vant库中的任意组件使用的时候按需引入,即用什么引入什么）
import styleImport, {VantResolve} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),]
})
