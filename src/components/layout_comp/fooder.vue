<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

//menu item type
interface MenuItem {
  id: number;
  title: string;
  pid: number;
  contentType: string;
  [key: string]: any;
}

//menu items
const menuItems = ref<MenuItem[]>([]);

//navigate to item
const navigateToItem = (item: MenuItem) => {
  console.log("Navigating to item:", item);

  if (item.contentType === "single_content" && item.contentId) {
    router.push(`/${item.id}/${item.contentId}`);
  } else if (item.contentType === "list_content" && item.listId) {
    router.push(`/list/${item.id}/${item.listId}`);
  } else if (item.contentType === "page_content" && item.pageId) {
    router.push(`/page/${item.id}/${item.pageId}`);
  } else {
    console.warn(
      `Cannot navigate: Unknown contentType "${item.contentType}" or missing ID property`
    );
    // Fallback navigation - you might want to navigate to a default page
    router.push(`/item/${item.id}`);
  }
};

//filtered menu items
const filteredMenuItems = computed(() => {
  return menuItems.value.filter((item) => item.pid === 0);
});

//fetch all menu items
const all_menuItems_fetch = async () => {
  try {
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
    console.log("API Response:", response.data.data.list);

    // Validate items before assigning
    const items = response.data.data.list || [];
    if (items.length === 0) {
      console.warn("No menu items received from API");
    } else {
      // Log first item to check structure
      console.log("Sample menu item structure:", items[0]);
    }

    menuItems.value = items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};
all_menuItems_fetch();
</script>

<template>
  <footer class="bg-gray-200 font-bold text-gray-700 p-4 rounded-t-lg">
    <div class="container mx-auto">
      <div class="grid grid-cols-3 my-4 gap-2">
        <div v-for="item in filteredMenuItems" :key="item.id" class="mx-auto">
          <button
            class="text-center mx-auto h-12"
            @click="navigateToItem(item)"
          >
            {{ item.title }}
          </button>
        </div>
      </div>
      <div class="grid border-t border-gray-500 pt-5 grid-cols-3 my-4 gap-2">
        <p class="text-center">
          &copy; {{ new Date().getFullYear() }} GoSmart. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
<style scoped></style>
