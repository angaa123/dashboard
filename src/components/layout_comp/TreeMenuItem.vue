<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export interface MenuItem {
  id: number;
  pid: number;
  title: string;
  children?: MenuItem[];
  contentType: string;
  url?: string | null;
  Open: boolean;
  contentId?: number | null;
  listId?: number | null;
  // contentType: string;
}

const { item } = defineProps<{
  item: MenuItem;
}>();

const emit = defineEmits<{
  toggle: [item: MenuItem];
}>();
</script>

<template>
  <div class="tree-item w-full">
    <SidebarMenuItem>
      <SidebarMenuButton @click="emit('toggle', item)" class="h-min">
        <div class="flex items-center">
          <ChevronRight
            v-if="item.children && item.children.length > 0"
            class="text-sm transition-transform duration-200"
            :size="16"
            :class="{ 'rotate-90': item.Open }"
          />
          <!-- <component :is="getIcon(item)" class="mr-2 w-4 h-4" /> -->
          <h1 class="">{{ item.title }}</h1>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>

    <div
      v-if="item.children && item.children.length > 0 && item.Open"
      class="pl-4"
    >
      <TreeMenuItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-item {
  @apply w-full;
}
</style>
