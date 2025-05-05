<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import Search1 from "@/components/layout_comp/search1.vue";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const isSearchOpen = ref(false);

function openSearchModal() {
  isSearchOpen.value = true;
}

function closeSearchModal() {
  isSearchOpen.value = false;
}
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
const searchResults = ref<MenuItem[]>([]);
const isSearching = ref(false);

//filtered menu items
const filteredMenuItems = computed(() => {
  if (isSearching.value && searchResults.value.length > 0) {
    return searchResults.value;
  }
  return menuItems.value.filter((item) => item.pid === 0);
});

//fetch all menu items
const all_menuItems_fetch = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebPages`,
    {
      pageSize: 50,
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
////////////////////////////////////////////////////////////
//search

// Debounce function
</script>

<template>
  <div class="container mx-auto flex flex-col items-center justify-center">
    <h1 class="text-center text-4xl font-bold my-4">Гарын авлага</h1>
    <p class="text-center text-gray-600">
      Attio-ийн бүх зүйлийн талаархи нийтлэг асуултуудын хариултыг аваарай
    </p>
    <Search1 :is-open="isSearchOpen" @close="closeSearchModal" />
    <button @click="openSearchModal" class="text-gray-600 hover:text-gray-900">
      <Search class="h-6 w-6" />
    </button>
    <!-- Regular content display when not searching -->
    <div
      class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 lg:px-32 px-4"
    >
      <div v-for="item in filteredMenuItems" :key="item.id" class="w-full">
        <template v-if="item.contentType === 'single_content'">
          <div class="border-2 rounded-xl">
            <a class="w-full" :href="`/${item.id}/${item.contentId}`">
              <Card v-if="item" class="mx-auto">
                <CardHeader>
                  <div class="w-20 m-auto h-20">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="w-full h-full"
                    />
                  </div>
                  <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                  <CardDescription>{{ item.intro }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div v-html="item.content" class="text-gray-600"></div>
                </CardContent>
              </Card>
            </a>
          </div>
        </template>
        <template v-else-if="item.contentType === 'list_content'">
          <div class="border-2 rounded-xl">
            <a class="w-full" :href="`/list/${item.id}/${item.listId}`">
              <Card v-if="item" class="mx-auto">
                <CardHeader>
                  <div class="w-20 m-auto h-20">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="w-full h-full"
                    />
                  </div>
                  <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                  <CardDescription>{{ item.intro }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div v-html="item.content" class="text-gray-600"></div>
                </CardContent>
              </Card>
            </a>
          </div>
        </template>
        <template v-else>
          <div class="border-2 rounded-xl">
            <a class="w-full" :href="`/page/${item.id}/${item.contentId}`">
              <Card v-if="item" class="mx-auto">
                <CardHeader>
                  <div class="w-20 m-auto h-20">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="w-full h-full"
                    />
                  </div>
                  <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                  <!-- <CardDescription>{{ item.intro }}</CardDescription> -->
                </CardHeader>
                <CardContent>
                  <div v-html="item.content" class="text-gray-600"></div>
                </CardContent>
              </Card>
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
