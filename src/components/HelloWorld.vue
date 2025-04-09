<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div class="w-full ml-4 flex flex-col gap-4">
    <h1 class="text-2xl font-bold">{{ msg }}</h1>

    <div class="card">
      <Button @click="count++">count is {{ count }}</Button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
