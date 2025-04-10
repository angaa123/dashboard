<script setup lang="ts">
import { RouterView } from "vue-router";
// defineProps<{ msg: string }>();

// const count = ref(0);
</script>

<template>
  <div class="w-full ml-4 flex flex-col gap-4">
    <RouterView />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
