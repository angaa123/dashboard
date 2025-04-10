<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;
const cat_id = route.params.cat_id;
</script>

<template>
  <div>
    <h1>Page {{ id }}</h1>
    <h2>Cat {{ cat_id }}</h2>
  </div>
</template>
