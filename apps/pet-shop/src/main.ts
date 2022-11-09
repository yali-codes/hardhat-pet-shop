import App from './App.vue';
import router from './router';
import { ethState } from '@stores/index';
import { useEthers } from '@hooks/index';
import { createApp } from 'vue';

const app = createApp(App).use(router);
router.isReady().then(() => app.mount('#app', true));

// routing front guard
router.beforeEach(async (_to, _from, next) => {
  if (ethState.provider) return next();
  // initialize ethers and smart contract before routing jump
  const { initializeEthers } = useEthers();
  const access = await initializeEthers();
  return access ? next() : false;
});
