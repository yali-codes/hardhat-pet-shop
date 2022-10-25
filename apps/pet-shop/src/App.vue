<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeConfig">
    <AppConfig>
      <router-view />
    </AppConfig>
  </NConfigProvider>
</template>

<script setup>
import AppConfig from '@components/config'
import { useTheme } from '@hooks/index'
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'

const { themeConfig } = useTheme()
</script>

<style lang="less">
@import url('@styles/app.less');
</style>
