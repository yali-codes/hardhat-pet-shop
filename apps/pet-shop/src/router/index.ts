import { routes } from '@router/config';
import { createRouter, createWebHashHistory, useRoute, useRouter, Router } from 'vue-router';

export type { Router };
export { useRoute, useRouter, routes };

// 创建路由对象
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const originalPush: Function = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch((err: any) => err);
};

export default router;
