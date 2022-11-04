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

<script lang="ts">
export default {
  name: 'Config',
};
</script>

<script lang="ts" setup>
import { NLoadingBarProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
</script>
