import App from './App.vue'
import router from './router'
import { ethStore } from '@stores/index'
import { useEthers } from '@hooks/index'
import { createApp } from 'vue'

createApp(App).use(router).mount('#app', true)

// Routing front guard
router.beforeEach(async (_, __, next) => {
  if (ethStore.initial) return next()
  // Initialize ethers and smart contract before routing jump,
  // so the useEthers method need to carry `next` parameter.
  const { initializeEthers } = useEthers()
  await initializeEthers()
  next()
})
