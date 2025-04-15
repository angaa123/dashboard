<script setup lang="ts">
import { RouterView } from "vue-router";
// import { toast } from "vue-sonner";

// toast("Token verified", {
//   duration: 2000,
//   position: "top-right",
// });
// defineProps<{ msg: string }>();

// const count = ref(0);
</script>

<template>
  <div class="w-full ml-4 flex flex-col gap-4">
    <RouterView />
    <!-- <Toaster position="top-right" /> -->
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
