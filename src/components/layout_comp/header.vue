<script setup lang="ts">
// import { ref } from "vue";
import headerLogo from "@/assets/logo-gosmart.png";
import { Search } from "lucide-vue-next";

// const isCollapse = ref(false);
</script>

<template>
  <header class="header fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <a href="/">
          <div class="flex items-center">
            <img :src="headerLogo" alt="logo" class="h-12 md:h-16" />
          </div>
        </a>

        <!-- Navigation links can be added here -->
        <nav class="hidden md:flex space-x-8">
          <!-- Placeholder for nav items -->
        </nav>
        <!-- Search -->
        <div class="flex items-center border-2 border-gray-300 rounded-md">
          <input
            type="text"
            placeholder="Хайх"
            class="w-full h-10 mx-4 focus:outline-none"
          />
          <Search class="w-6 h-6 text-gray-500 mr-2" />
        </div>

        <!-- Mobile menu button -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  transition: all 0.3s ease;
}
</style>
