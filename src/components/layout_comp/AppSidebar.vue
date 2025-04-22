<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const my_location = computed(() => route.params.titel_id);

// Function to expand menu items based on current route
const expandCurrentPath = (items: MenuItem[]) => {
  const currentId = Number(my_location.value);
  if (!currentId) return;

  const findAndExpandPath = (
    items: MenuItem[],
    targetId: number,
    path: MenuItem[] = []
  ): boolean => {
    for (const item of items) {
      const currentPath = [...path, item];

      // If we found the target item or it's in the children
      if (item.id === targetId) {
        // Expand all items in the path
        currentPath.forEach((pathItem) => {
          pathItem.Open = true;
        });
        return true;
      }

      // Check children recursively
      if (
        item.children?.length &&
        findAndExpandPath(item.children, targetId, currentPath)
      ) {
        return true;
      }
    }
    return false;
  };

  findAndExpandPath(items, currentId);
};

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

  // Auto-expand menu items based on current location
  expandCurrentPath(menuItems.value);
};
menuItems2();

const toggleItem = async (item: MenuItem) => {
  // Create a deep copy of the menu items to trigger reactivity
  const updatedItems = JSON.parse(JSON.stringify(menuItems.value));
  const currentId = Number(my_location.value);

  // Find and update the item in the tree
  const updateItemInTree = (items: MenuItem[]): boolean => {
    for (const menuItem of items) {
      if (menuItem.id === item.id) {
        // Don't collapse if this is the current location
        if (item.id === currentId && item.Open) {
          return true; // Found but didn't change state
        }

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

  // If this is the current location and was already expanded, don't show a toggle message
  if (!(item.id === currentId && item.Open)) {
    toast(`${item.title} ${!item.Open ? "expanded" : "collapsed"}`, {
      duration: 2000,
    });
  }

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

// Watch for route changes to update expanded items
watch(
  () => route.params.titel_id,
  (newId) => {
    if (newId && menuItems.value.length > 0) {
      expandCurrentPath(menuItems.value);
    }
  },
  { immediate: true }
);
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
