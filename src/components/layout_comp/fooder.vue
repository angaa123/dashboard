<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";

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

//filtered menu items
const filteredMenuItems = computed(() => {
  return menuItems.value.filter((item) => item.pid === 0);
});

//fetch all menu items
const all_menuItems_fetch = async () => {
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
  // menuItems.value = createTreeStructure(response.data.data.list);
  menuItems.value = response.data.data.list as any;
};
all_menuItems_fetch();
</script>

<template>
  <footer class="bg-gray-200 font-bold text-gray-700 p-4 rounded-t-lg">
    <div class="container mx-auto">
      <div class="grid grid-cols-3 my-4 gap-2">
        <div v-for="item in filteredMenuItems" :key="item.id" class="">
          <template v-if="item.contentType === 'single_content'">
            <a
              class="text-center h-12 m-1"
              :href="`/${item.id}/${item.contentId}`"
            >
              <p class="text-center h-12 m-1">{{ item.title }}</p>
            </a>
          </template>
          <template v-else-if="item.contentType === 'list_content'">
            <a
              class="text-center h-12 m-1"
              :href="`/list/${item.id}/${item.listId}`"
            >
              <p class="text-center h-12 m-1">{{ item.title }}</p>
            </a>
          </template>
          <template v-else>
            <a
              class="text-center h-12 m-1"
              :href="`page/${item.id}/${item.pageId}`"
            >
              <p class="text-center h-12 m-1">{{ item.title }}</p>
            </a>
          </template>
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
