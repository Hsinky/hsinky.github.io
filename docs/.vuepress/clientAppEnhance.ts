import { defineClientAppEnhance } from '@vuepress/client'
import CustomLayout from './theme/layouts/Layout.vue'

export default defineClientAppEnhance(({ app }) => {
  app.component('CustomLayout', CustomLayout)
})