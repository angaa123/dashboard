<script setup lang="ts">
import { ref } from "vue";
import headerLogo from "@/assets/logo-gosmart.png";
import { Search } from "lucide-vue-next";
import { useSearch } from "@/composables/useSearch";
import { useRouter } from "vue-router";
import axios from "axios";

// Search functionality
const router = useRouter();
const { search, onFinalSearch } = useSearch();
const isSearching = ref(false);
const searchResults = ref<any[]>([]);
const searchResults_titels = ref<any[]>([]);

// Show/hide dropdown
const showDropdown = ref(false);

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

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
    showDropdown.value = false;
    return;
  }

  isSearching.value = true;
  const result = await onFinalSearch();
  searchResults.value = result.unique_arr || [];
  searchResults_titels.value = result.titelsResults_arr || [];
  showDropdown.value = true;
};

// Debounced search function with 500ms delay
const debouncedSearch = debounce(handleSearch, 500);

const navigateToItem = (item: any) => {
  showDropdown.value = false;
  if (item.contentType === "single_content") {
    router.push(`/${item.id}/${item.contentId}`);
  } else if (item.contentType === "list_content") {
    router.push(`/list/${item.id}/${item.listId}`);
  } else {
    router.push(`/page/${item.id}/${item.contentId}`);
  }
};

const navigateToItem_content = async (item: any) => {
  showDropdown.value = false;
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
    const main_title = response.data.data.list;
    console.log("main_title", main_title);

    if (main_title && main_title.length > 0) {
      router.push(`/list/${main_title[0].id}/${item.listId}#${item.title}`);
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
  <header class="header fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <a href="/">
          <div class="flex items-center">
            <img :src="headerLogo" alt="logo" class="h-8 md:h-12" />
          </div>
        </a>

        <!-- Navigation links can be added here -->
        <nav class="hidden md:flex space-x-8">
          <!-- Placeholder for nav items -->
        </nav>
        <!-- Search -->
        <div
          class="flex items-center border-2 border-gray-300 rounded-md relative"
        >
          <input
            type="text"
            placeholder="Хайх"
            v-model="search"
            @input="debouncedSearch"
            @focus="
              search.trim() && search.length >= 3 && (showDropdown = true)
            "
            @blur="hideDropdown"
            class="w-full h-10 mx-4 focus:outline-none"
          />
          <Search class="w-6 h-6 text-gray-500 mr-2" />

          <!-- Search Results Dropdown -->
          <div
            v-if="showDropdown && isSearching && search.trim()"
            class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto z-50"
          >
            <!-- Message for less than 3 characters -->
            <div
              v-if="search.length < 3"
              class="text-center py-4 text-gray-500"
            >
              та 3-аас илүү тэмдэгт оруулна уу.
            </div>

            <!-- Results from title search -->
            <div
              v-else-if="searchResults_titels.length > 0"
              class="p-2 border-b"
            >
              <h3 class="text-sm font-medium text-gray-700 px-2 py-1">
                Гарчигууд
              </h3>
              <div
                v-for="item in searchResults_titels"
                :key="`title-${item.id}`"
                class="p-2 hover:bg-gray-100 cursor-pointer rounded"
                @mousedown="navigateToItem(item)"
              >
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-xs text-gray-500 truncate">
                  {{ item.intro }}
                </div>
              </div>
            </div>

            <!-- Results from content search -->
            <div
              v-if="search.length >= 3 && searchResults.length > 0"
              class="p-2"
            >
              <h3 class="text-sm font-medium text-gray-700 px-2 py-1">
                Мэдээлэл
              </h3>
              <div
                v-for="item in searchResults"
                :key="`content-${item.id}`"
                class="p-2 hover:bg-gray-100 cursor-pointer rounded"
                @mousedown="navigateToItem_content(item)"
              >
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-xs text-gray-500 truncate">
                  {{ item.intro }}
                </div>
              </div>
            </div>

            <!-- No results message -->
            <div
              v-if="
                search.length >= 3 &&
                searchResults.length === 0 &&
                searchResults_titels.length === 0
              "
              class="text-center py-4 text-gray-500"
            >
              "{{ search }}" байхгүй байна
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  transition: all 0.3s ease;
}
</style>
