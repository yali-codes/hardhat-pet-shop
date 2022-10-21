<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <slot></slot>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<script>
export default {
  name: 'Config',
}
</script>

<script setup>
import { NLoadingBarProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
</script>
