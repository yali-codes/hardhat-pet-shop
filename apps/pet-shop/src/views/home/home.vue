<template>
  <div class="home-page">
    <h1>Hello, Devie's Pet Shop.</h1>
    <n-button type="primary" size="small" circle @click="handleClick">Go</n-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
};
</script>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import { useRouter, Router } from '@router/index';

const router: Router = useRouter();
const handleClick: () => void = () => {
  router.push('/pets');
};
</script>

<style lang="less" scoped>
@import url('./home.less');
</style>
