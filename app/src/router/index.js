import { routes } from '@router/config'
import { createRouter, createWebHashHistory, useRoute, useRouter } from 'vue-router'

export { useRoute, useRouter, routes }

// 创建路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
