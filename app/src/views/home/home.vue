<template>
  <div class="home-page">
    <HelloWorld msg="Hello, Devie's Pet Shop." />
    <n-button type="primary" size="small" circle @click="handleClick">Go</n-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<script setup>
import HelloWorld from '@components/HelloWorld.vue'
import { NButton } from 'naive-ui'
import { useRouter } from '@router/index'

const router = useRouter()
const handleClick = () => {
  router.push('/pets')
}
</script>

<style lang="less" scoped>
@import url('./home.less');
</style>
