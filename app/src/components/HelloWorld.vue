<template>
  <h1>{{ msg }}</h1>
</template>

<script>
export default {
  name: 'HelloWorld',
}
</script>

<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>
