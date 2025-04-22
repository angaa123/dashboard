<script setup lang="ts">
import { RouterView } from "vue-router";
import Footer from "@/components/layout_comp/fooder.vue";

// toast("Token verified", {
//   duration: 2000,
//   position: "top-right",
// });
// defineProps<{ msg: string }>();

// const count = ref(0);
</script>

<template>
  <div
    class="w-full min-h-screen mt-16 md:mt-20 md:ml-4 md:mr-4 flex flex-col justify-between gap-4"
  >
    <RouterView />
    <!-- <div
      v-for="item in listData"
      :key="item.id"
      class="flex h-10 bg-amber-600 flex-col gap-4"
    >
      console.log(item)
      {{ item.title }}
    </div> -->
    <Footer />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
