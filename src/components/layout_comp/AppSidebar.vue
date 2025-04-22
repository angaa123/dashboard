<script setup lang="ts">
import { ref } from "vue";
import titelData from "@/components/mockdata/titel.json";
import { toast } from "vue-sonner";
import TreeMenuItem, {
  type MenuItem,
} from "@/components/layout_comp/TreeMenuItem.vue";
import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  // SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useRouter } from "vue-router";

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
const menuItems2 = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebPages`,
    {
      pageSize: 10,
      pageNumber: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  console.log(response.data.data.list);
  menuItems.value = createTreeStructure(response.data.data.list);
};
menuItems2();
const router = useRouter();

const toggleItem = (item: MenuItem) => {
  // Create a deep copy of the menu items to trigger reactivity
  const updatedItems = JSON.parse(JSON.stringify(menuItems.value));

  // Find and update the item in the tree
  const updateItemInTree = (items: MenuItem[]): boolean => {
    for (const menuItem of items) {
      if (menuItem.id === item.id) {
        menuItem.Open = !menuItem.Open;
        return true;
      }
      if (menuItem.children?.length) {
        if (updateItemInTree(menuItem.children)) {
          return true;
        }
      }
    }
    return false;
  };

  updateItemInTree(updatedItems);
  menuItems.value = updatedItems;

  toast(`${item.title} ${!item.Open ? "expanded" : "collapsed"}`, {
    duration: 2000,
  });
  switch (item.contentType) {
    case "list_content":
      router.push(`/list/${item.id}/${item.listId}`);
      break;
    case "single_content":
      router.push(`/${item.id}/${item.contentId}`);
      break;
    case "jump_url":
      router.push(`${item.url}`);
      break;
  }
  // // Navigate to the page with the correct parameters
  // const categoryId = item.pid || item.id; // Use parent ID if available, otherwise use item ID
  // router.push(`/pagr/${item.id}/${categoryId}`);
};
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarHeader>
          <h1 class="text-xl mt-16 font-bold">
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
