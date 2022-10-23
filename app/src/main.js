import App from './App.vue'
import router from './router'
import { ethState } from '@stores/index'
import { useEthers } from '@hooks/index'
import { createApp } from 'vue'

createApp(App).use(router).mount('#app', true)

// routing front guard
router.beforeEach(async (to, from, next) => {
  if (ethState.provider) return next()
  // initialize ethers and smart contract before routing jump
  const { initializeEthers } = useEthers()
  const access = await initializeEthers()
  return access ? next() : false
})
