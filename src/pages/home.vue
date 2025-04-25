<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { Search } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearch } from "@/composables/useSearch";
import { useRouter } from "vue-router";

//menu item type
interface MenuItem {
  id: number;
  title: string;
  pid: number;
  contentType: string;
  [key: string]: any;
}

const router = useRouter();

//menu items
const menuItems = ref<MenuItem[]>([]);
const searchResults = ref<MenuItem[]>([]);
const searchResults_titels = ref<MenuItem[]>([]);
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
const { search, onFinalSearch } = useSearch();

// Debounce function
const debounce = (fn: Function, delay: number) => {
  let timeout: number | undefined;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = async () => {
  const trimmedSearch = search.value.trim();

  if (!trimmedSearch || trimmedSearch.length < 3) {
    isSearching.value = false;
    searchResults.value = [];
    searchResults_titels.value = [];
    return;
  }

  isSearching.value = true;
  const result = await onFinalSearch();
  searchResults.value = result.unique_arr || [];
  searchResults_titels.value = result.titelsResults_arr || [];
};

// Debounced search function with 500ms delay
const debouncedSearch = debounce(handleSearch, 500);

const navigateToItem = (item: MenuItem) => {
  if (item.contentType === "single_content") {
    router.push(`/${item.id}/${item.contentId}`);
  } else if (item.contentType === "list_content") {
    router.push(`/list/${item.id}/${item.listId}`);
  } else {
    router.push(`/page/${item.id}/${item.contentId}`);
  }
};

const navigateToItem_content = async (item: MenuItem) => {
  const main_title = ref<any[]>([]);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/Task/WebPages`,
      {
        pageSize: 10,
        pageNumber: 1,
        FILTERS: [
          {
            COLUMN: "listId",
            OPERATOR: "IS",
            VALUE: item.listId,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    main_title.value = response.data.data.list;
    console.log("main_title", main_title.value);

    if (main_title.value && main_title.value.length > 0) {
      router.push(
        `/list/${main_title.value[0].id}/${item.listId}#${item.title}`
      );
    } else {
      console.error("No title data found");
      router.push(`/list/${item.id}/${item.listId}`);
    }
  } catch (error) {
    console.error("Error fetching title data:", error);
    router.push(`/list/${item.id}/${item.listId}`);
  }
};
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
        v-model="search"
        class="w-full h-full bg-none rounded-md focus:outline-none"
        @input="debouncedSearch"
      />
      <div class="flex m-3 items-center justify-center">
        <Search name="mdi:search" class="text-gray-500 flex" />
      </div>
    </div>

    <!-- Search Results Section -->
    <div v-if="isSearching && search.trim()" class="w-full mt-4">
      <h2 class="text-xl font-semibold mb-3">"{{ search }}" хайлтын үр дүн</h2>

      <!-- Results from title search -->
      <div v-if="searchResults_titels.length > 0" class="mb-5">
        <h3 class="text-lg font-medium mb-2">Гарчигууд</h3>
        <div class="space-y-2">
          <div
            v-for="item in searchResults_titels"
            :key="`title-${item.id}`"
            class="p-3 bg-white border rounded-md shadow-sm hover:shadow-md cursor-pointer"
            @click="navigateToItem(item)"
          >
            <div class="font-medium">{{ item.title }}</div>
            <div class="text-sm text-gray-500">{{ item.intro }}</div>
          </div>
        </div>
      </div>

      <!-- Results from content search -->
      <div v-if="searchResults.length > 0" class="mb-5">
        <h3 class="text-lg font-medium mb-2">Мэдээлэл</h3>
        <div class="space-y-2">
          <div
            v-for="item in searchResults"
            :key="`content-${item.id}`"
            class="p-3 bg-white border rounded-md shadow-sm hover:shadow-md cursor-pointer"
            @click="navigateToItem_content(item)"
          >
            <div class="font-medium">{{ item.title }}</div>
            <div class="text-sm text-gray-500">{{ item.intro }}</div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div v-if="search.length < 3">та 3-аас илүү тэмдэгт оруулна уу.</div>
      <div
        v-if="
          search.length > 3 &&
          searchResults.length === 0 &&
          searchResults_titels.length === 0
        "
        class="text-center py-4"
      >
        "{{ search }}" байхгүй байна
      </div>
    </div>

    <!-- Regular content display when not searching -->
    <div
      v-if="!isSearching || !search.trim()"
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
