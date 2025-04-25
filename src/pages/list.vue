<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, onMounted, nextTick, watch } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MockListItem } from "@/types/mock";
import axios from "axios";

//get list id from route
const route = useRoute();
const list_id = computed(() => route.params.list_id);
const titel_id = computed(() => route.params.titel_id);
//get list data type
const list = ref<MockListItem[]>([]);

//get main title from api
const main_title = ref<any[]>([]);
const fetchMainTitle = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebPages`,
    {
      pageSize: 50,
      pageNumber: 1,
      FILTERS: [
        {
          COLUMN: "id",
          OPERATOR: "IS",
          VALUE: titel_id.value,
        },
      ],
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  main_title.value = response.data.data.list;
};
fetchMainTitle();

//fetch list data from api
const fetchList = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebItemDetails`,
    {
      pageSize: 10,
      pageNumber: 1,
      FILTERS: [
        {
          COLUMN: "listId",
          OPERATOR: "IS",
          VALUE: list_id.value,
        },
      ],
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  list.value = response.data.data.list;
  console.log("list", list.value[0].title);

  // After data is loaded, scroll to the hash element if exists
  nextTick(() => {
    scrollToHashElement();
  });
};

// Function to scroll to element based on URL hash
interface SelectedTitel {
  id: string;
  title: string;
}

const selectedTitel = ref<SelectedTitel | null>(null);
const scrollToHashElement = () => {
  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.substring(1));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};

// Function to handle anchor clicks with smooth scrolling
const handleAnchorClick = (
  event: Event,
  itemTitle: string,
  itemId: number | string
) => {
  event.preventDefault();
  const element = document.getElementById(itemTitle);
  if (element) {
    // Update URL hash for sharing
    window.history.pushState(null, "", `#${encodeURIComponent(itemTitle)}`);
    // Smooth scroll to element
    element.scrollIntoView({ behavior: "smooth" });
  }
  selectedTitel.value = { id: String(itemId), title: itemTitle };
};

fetchList();

// Listen for hash changes in URL
onMounted(() => {
  window.addEventListener("hashchange", scrollToHashElement);
});

//////////////
const titelData = ref<any[]>([]);
const titelData2 = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebPages`,
    {
      pageSize: 10,
      pageNumber: 1,
      FILTERS: [
        {
          COLUMN: "pid",
          OPERATOR: "IS",
          VALUE: titel_id.value,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  console.log(response.data.data.list);
  titelData.value = response.data.data.list;
};
titelData2();

// Watch for route parameter changes to refresh data
watch(
  [list_id, titel_id],
  ([newListId, newTitelId], [oldListId, oldTitelId]) => {
    if (newListId !== oldListId || newTitelId !== oldTitelId) {
      fetchMainTitle();
      fetchList();
      titelData2();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container py-8 xl:px-20">
    <h1 class="text-3xl text-center font-bold mb-8">
      {{ main_title[0].title }}
    </h1>
    <div
      v-if="main_title[0].cdnUrl && main_title[0].defaultAttachUrl"
      class="relative"
    >
      <img
        :src="main_title[0].cdnUrl + main_title[0].defaultAttachUrl"
        alt="list-bg"
        class="w-full h-auto"
      />
    </div>
    <p class="text-gray-800 pb-8 text-xl md:text-xl 0 text-center">
      {{ main_title[0].intro }}
    </p>
    <div class="gap-6 flex relativ border-t-2">
      <div class="w-full flex flex-col gap-4 xl:w-5/6">
        <Card
          v-for="item in list"
          :key="item.id"
          :id="item.title"
          class="card-content"
        >
          <CardHeader>
            <CardTitle class="text-2xl">{{ item.title }}</CardTitle>
            <CardDescription>{{ item.intro }}</CardDescription>
            <div v-if="item.defaultAttachUrl">
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
            </div>
          </CardHeader>
          <CardContent>
            <div v-html="item.content" class="text-gray-600 content"></div>
          </CardContent>
          <!-- <CardFooter class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">
              {{ new Date(item.date).toLocaleDateString() }}
            </span>
          </CardFooter> -->
        </Card>
      </div>
      <div
        class="hidden w-1/6 p-2 rounded-lg md:flex flex-col gap-4 fixed top-24 right-8 shadow-lg"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="flex flex-col bg-white rounded-lg hover:scale-101 transition-all duration-300"
        >
          <a
            href="#"
            @click="(e) => handleAnchorClick(e, item.title, item.id)"
            class="text-gray-600"
            :class="{
              'font-bold text-black ': selectedTitel?.id === String(item.id),
            }"
            >{{ item.title }}</a
          >
        </div>
      </div>
    </div>

    <section class="mt-8" v-if="titelData.length > 0">
      <div
        v-for="item in titelData"
        :key="item.id"
        class="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <a
          v-if="item.contentType === 'list_content'"
          :href="`/list/${item.id}/${item.listId}`"
          class="hover:scale-102 hover:shadow-lg transition-all duration-300"
        >
          <Card>
            <CardHeader>
              <CardTitle class="">{{ item.title }}</CardTitle>
              <CardDescription>{{ item.intro }}</CardDescription>
            </CardHeader>
          </Card>
        </a>
        <a
          v-if="item.contentType === 'single_content'"
          :href="`/${item.id}/${item.contentId}`"
          class="hover:scale-102 hover:shadow-lg transition-all duration-300"
        >
          <Card>
            <CardHeader>
              <CardTitle class="">{{ item.title }}</CardTitle>
              <!-- <CardDescription>{{ item.intro }}</CardDescription> -->
            </CardHeader>
          </Card>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card-content {
  scroll-behavior: smooth;
  scroll-margin-top: 100px;
}
</style>
