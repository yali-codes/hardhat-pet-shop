<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <Dialog />
      <NNotificationProvider>
        <Notification />
        <NMessageProvider>
          <Message />
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
import Dialog from './Dialog.vue'
import Notification from './Notification.vue'
import Message from './Message.vue'
import { NLoadingBarProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
</script>
