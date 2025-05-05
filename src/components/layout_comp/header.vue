<script setup lang="ts">
import { ref } from "vue";
import headerLogo from "@/assets/logo-gosmart.png";
import Search1 from "./search1.vue";
import { Search } from "lucide-vue-next";

const isSearchOpen = ref(false);

function openSearchModal() {
  isSearchOpen.value = true;
}

function closeSearchModal() {
  isSearchOpen.value = false;
}
</script>

<template>
  <header
    class="header fixed top-0 left-0 w-full font-gilroy_medium bg-white border-b border-gray-200 border-1 z-50"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 pt-2 lg:mx-10">
        <a href="/">
          <div class="flex items-center">
            <img :src="headerLogo" alt="logo" class="h-8 md:h-12" />
          </div>
        </a>
        <Search1 :is-open="isSearchOpen" @close="closeSearchModal" />
        <!-- Navigation links can be added here -->
        <nav class="block md:hidden">
          <button
            @click="openSearchModal"
            class="text-gray-600 hover:text-gray-900 p-2 rounded-md border-1 border-gray-300 flex flex-row items-center justify-between"
          >
            <Search class="h-6 w-6" />
          </button>
        </nav>
        <nav class="hidden md:flex space-x-8">
          <!-- Placeholder for nav items -->
          <button
            @click="openSearchModal"
            class="text-gray-600 hover:text-gray-900 p-2 rounded-md border-1 border-gray-300 flex flex-row items-center w-[300px] justify-between"
          >
            <p
              class="text-gray-600 hover:text-gray-900"
              style="font-family: 'Gilroy-SemiBold'"
            >
              хайх
            </p>
            <Search class="h-6 w-6" />
          </button>
        </nav>
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
