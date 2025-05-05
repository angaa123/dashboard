<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import Search1 from "@/components/layout_comp/search1.vue";
import { Card, CardHeader } from "@/components/ui/card";

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
  <div
    class="container mx-auto flex flex-col items-center justify-center mb-12"
  >
    <h1 class="text-center text-6xl mt-32 font-adineue font-bold">
      Гарын авлага
    </h1>
    <p class="text-center my-4 font-semibold text-xl max-w-[452px] text-wrap-2">
      GOSmart-ийн бүх зүйлийн талаар нийтлэг асуултуудын хариултыг аваарай
    </p>
    <Search1 :is-open="isSearchOpen" @close="closeSearchModal" />

    <button
      @click="openSearchModal"
      class="text-gray-600 hover:text-gray-900 flex justify-centerb my-4 px-4 py-3 flex-row justify-between rounded-md border-1 border-gray-300 w-1/2 items-center hover:cursor-pointer font-semibold"
    >
      <p class="text-gray-600">хайх</p>
      <Search class="h-6 w-6" />
    </button>
    <!-- Regular content display when not searching -->
    <div
      class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 xl:px-32 px-4 lg:mt-20 gap-y-3"
    >
      <div v-for="item in filteredMenuItems" :key="item.id" class="w-full">
        <template v-if="item.contentType === 'single_content'">
          <div class="border-1 rounded-xl">
            <a class="w-full" :href="`/${item.id}/${item.contentId}`">
              <Card v-if="item" class="mx-auto">
                <CardHeader class="flex flex-row gap-6 p-5">
                  <div class="w-20 h-20">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="aspect-square w-full h-full"
                    />
                  </div>
                  <span class="flex flex-col">
                    <span class="text-sm font-bold">
                      {{ item.title }}
                    </span>
                    &nbsp;
                    <span class="text-sm text-gray-600">
                      {{ item.intro }}
                    </span>
                  </span>
                </CardHeader>
              </Card>
            </a>
          </div>
        </template>
        <template v-else-if="item.contentType === 'list_content'">
          <div class="border-1 rounded-xl">
            <a class="w-full" :href="`/list/${item.id}/${item.listId}`">
              <Card v-if="item" class="mx-auto p-5">
                <CardHeader class="flex flex-row gap-6 px-5">
                  <div class="w-20 h-20">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="aspect-square w-full h-full"
                    />
                  </div>
                  <span class="flex flex-col">
                    <span class="text-sm font-bold">{{ item.title }}</span>
                    &nbsp;
                    <span class="text-sm text-gray-600">{{ item.intro }}</span>
                  </span>
                </CardHeader>
              </Card>
            </a>
          </div>
        </template>
        <template v-else>
          <div class="border-1 rounded-xl">
            <a class="w-full" :href="`/page/${item.id}/${item.contentId}`">
              <Card v-if="item" class="mx-auto p-5">
                <CardHeader class="flex flex-row gap-6 px-5">
                  <div class="aspect-square w-12 h-12">
                    <img
                      :src="
                        item.defaultAttachUrl &&
                        item.defaultAttachUrl.startsWith('http')
                          ? item.defaultAttachUrl
                          : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                      "
                      alt="content"
                      class="aspect-square w-full h-full"
                    />
                  </div>
                  <span class="line-clamp-2">
                    <span class="text-sm font-bold">
                      {{ item.title }}
                    </span>
                    &nbsp;
                    <span class="text-sm text-gray-600">
                      {{ item.intro }}
                    </span>
                  </span>
                </CardHeader>
              </Card>
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
