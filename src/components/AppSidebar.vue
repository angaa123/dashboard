<script setup lang="ts">
import { ref } from "vue";
import titelData from "@/components/mockdata/titel.json";
import { toast } from "vue-sonner";
import TreeMenuItem, { type MenuItem } from "@/components/TreeMenuItem.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  // SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

// Convert flat data to hierarchical structure
const createTreeStructure = (items: any[]): MenuItem[] => {
  const map = new Map<number, MenuItem>();
  const result: MenuItem[] = [];

  // First, create a map of all items
  items.forEach((item) => {
    const newItem = { ...item, children: [], isOpen: false };
    map.set(item.id, newItem);
  });

  // Then, establish parent-child relationships
  items.forEach((item) => {
    const current = map.get(item.id);
    if (item.pid === 0) {
      result.push(current!);
    } else {
      const parent = map.get(item.pid);
      if (parent) {
        parent.children?.push(current!);
      }
    }
  });

  return result;
};

const menuItems = ref(createTreeStructure(titelData.list));

const toggleItem = (item: MenuItem) => {
  item.isOpen = !item.isOpen;
  toast(`${item.title} ${item.isOpen ? "expanded" : "collapsed"}`, {
    duration: 2000,
  });
};
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarHeader>
          <h1 class="text-xl font-bold">
            GoSmart iin butegdhuuniig heregleh zaavar
          </h1>
          <!-- <SidebarGroupLabel>Navigation</SidebarGroupLabel> -->
        </SidebarHeader>
        <!-- <SidebarGroupLabel>Navigation</SidebarGroupLabel> -->
        <SidebarGroupContent>
          <SidebarMenu>
            <div class="tree-sidebar flex flex-col w-full">
              <TreeMenuItem
                v-for="item in menuItems"
                :key="item.id"
                :item="item"
                @toggle="toggleItem"
              />
            </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<style scoped>
/* .tree-sidebar {
  @apply flex flex-col w-full;
} */
</style>
