<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue";
import { Button } from "@/components/ui/button";
</script>

<template>
  <div>
    <Button>Click me</Button>
    <h1 class="text-3xl font-bold underline text-red-500">Hello World</h1>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
