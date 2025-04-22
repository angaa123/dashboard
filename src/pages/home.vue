<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
//////////////
</script>

<template>
  <div class="container mx-auto flex flex-col items-center justify-center">
    <h1 class="text-center text-4xl font-bold my-4">Гарын авлага</h1>
    <div
      class="lg:w-1/2 md:w-2/3 w-full bg-gray-100 flex items-center justify-center rounded-md p-2"
    >
      <input
        type="text"
        placeholder="Search help articles"
        class="w-full h-full bg-none rounded-md focus:outline-none"
      />
      <div class="flex m-3 items-center justify-center">
        <Search name="mdi:search" class="text-gray-500 flex" />
      </div>
    </div>
    <div class="w-full grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
      <div v-for="item in filteredMenuItems" :key="item.id" class="w-full">
        <template v-if="item.contentType === 'single_content'">
          <a class="w-full" :href="`/${item.id}/${item.contentId}`">
            <Card v-if="item" class="mx-auto">
              <CardHeader>
                <CardTitle class="text-3xl">{{ item.title }}</CardTitle>
                <CardDescription>{{ item.intro }}</CardDescription>
                <img
                  :src="
                    item.defaultAttachUrl &&
                    item.defaultAttachUrl.startsWith('http')
                      ? item.defaultAttachUrl
                      : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                  "
                  alt="content"
                  class="w-full h-auto"
                />
              </CardHeader>
              <CardContent>
                <div
                  v-html="item.content"
                  class="text-gray-600 dark:text-gray-300"
                ></div>
              </CardContent>
              <CardFooter class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">
                  {{ new Date(item.date).toLocaleDateString() }}
                </span>
              </CardFooter>
            </Card>
          </a>
        </template>
        <template v-else-if="item.contentType === 'list_content'">
          <a class="w-full" :href="`/list/${item.id}/${item.listId}`">
            <Card v-if="item" class="mx-auto">
              <CardHeader>
                <CardTitle class="text-3xl">{{ item.title }}</CardTitle>
                <CardDescription>{{ item.intro }}</CardDescription>
                <img
                  :src="
                    item.defaultAttachUrl &&
                    item.defaultAttachUrl.startsWith('http')
                      ? item.defaultAttachUrl
                      : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                  "
                  alt="content"
                  class="w-full h-auto"
                />
              </CardHeader>
              <CardContent>
                <div
                  v-html="item.content"
                  class="text-gray-600 dark:text-gray-300"
                ></div>
              </CardContent>
              <CardFooter class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">
                  {{ new Date(item.date).toLocaleDateString() }}
                </span>
              </CardFooter>
            </Card>
          </a>
        </template>
        <template v-else>
          <a class="w-full" :href="`/page/${item.id}/${item.contentId}`">
            <Card v-if="item" class="mx-auto">
              <CardHeader>
                <CardTitle class="text-3xl">{{ item.title }}</CardTitle>
                <CardDescription>{{ item.intro }}</CardDescription>
                <img
                  :src="
                    item.defaultAttachUrl &&
                    item.defaultAttachUrl.startsWith('http')
                      ? item.defaultAttachUrl
                      : (item.cdnUrl || '') + (item.defaultAttachUrl || '')
                  "
                  alt="content"
                  class="w-full h-auto"
                />
              </CardHeader>
              <CardContent>
                <div
                  v-html="item.content"
                  class="text-gray-600 dark:text-gray-300"
                ></div>
              </CardContent>
              <CardFooter class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">
                  {{ new Date(item.date).toLocaleDateString() }}
                </span>
              </CardFooter>
            </Card>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
