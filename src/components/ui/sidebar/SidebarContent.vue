<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Search } from "lucide-vue-next";
import Search1 from "@/components/layout_comp/search1.vue";
import { ref } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const isSearchOpen = ref(false);

function openSearchModal() {
  isSearchOpen.value = true;
}

function closeSearchModal() {
  isSearchOpen.value = false;
}
</script>

<template>
  <nav class="hidden md:flex mb-8 mr-4 space-x-8">
    <Search1 :is-open="isSearchOpen" @close="closeSearchModal" />
    <!-- Placeholder for nav items -->
    <button
      @click="openSearchModal"
      class="text-gray-600 hover:text-gray-900 px-2 py-[2px] mt-30 rounded-md border-1 border-gray-300 flex flex-row items-center w-[300px] justify-between"
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
  <div
    data-slot="sidebar-content"
    data-sidebar="content"
    style="
      /* scrollbar-width: none; */
      /* scrollbar-color: transparent transparent; */
      /* -ms-overflow-style: none;
      scrollbar-color: black;
      scrollbar-width: none; */
    "
    :class="
      cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
