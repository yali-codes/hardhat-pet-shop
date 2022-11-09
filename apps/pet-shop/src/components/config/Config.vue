<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <slot></slot>
      </NMessageProvider>
    </NNotificationProvider>
  </NDialogProvider>
</template>

<script lang="ts" setup>
import { NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
</script>
