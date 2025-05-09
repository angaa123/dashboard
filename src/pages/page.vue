<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  // CardImage,
  CardTitle,
} from "@/components/ui/card";
// import apimockdata from "@/components/mockdata/apimockdata.json";
import type { MockListItem } from "@/types/mock";

// Define interface for the titel data items
interface TitelDataItem {
  id: number;
  title: string;
  intro: string;
  contentType: string;
  listId?: number;
  contentId?: number;
}

const route = useRoute();
const router = useRouter();
const cont_id = computed(() => route.params.cont_id);
const titel_id = computed(() => route.params.titel_id);
const content = ref<MockListItem | undefined>(undefined);
const getContent = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/Task/WebItemDetails`,
      {
        pageSize: 1000,
        pageNumber: 1,
        FILTERS: [
          {
            COLUMN: "id",
            OPERATOR: "IS",
            VALUE: cont_id.value,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    console.log(response.data);
    content.value = response.data.data.list[0];
  } catch (error) {
    console.error(error);
  }
};
getContent();
//////////////
const titelData = ref<TitelDataItem[]>([]);
const titelData2 = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Task/WebPages`,
    {
      pageSize: 50,
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

const handleClick = async (item: TitelDataItem) => {
  if (item.contentType === "single_content") {
    // Navigate first
    router.push(`/${item.id}/${item.contentId}`);
    // Then reload the current page after navigation completes
  } else if (item.contentType === "list_content") {
    router.push(`/list/${item.id}/${item.listId}`);
  } else {
    console.log(item);
  }
};

// Watch for route parameter changes to refresh data
watch(
  [cont_id, titel_id],
  ([newContId, newTitelId], [oldContId, oldTitelId]) => {
    if (newContId !== oldContId || newTitelId !== oldTitelId) {
      getContent();
      titelData2();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container mx-auto py-8 px-32">
    <div class="mb-8" v-if="content">
      <Card class="mx-auto" :id="content.title">
        <CardHeader>
          <CardTitle class="text-3xl">{{ content.title }}</CardTitle>
          <CardDescription>{{ content.intro }}</CardDescription>
          <img
            :src="
              content.defaultAttachUrl &&
              content.defaultAttachUrl.startsWith('http')
                ? content.defaultAttachUrl
                : (content.cdnUrl || '') + (content.defaultAttachUrl || '')
            "
            alt="content"
            class="w-full h-auto rounded-md object-cover mt-4"
          />
        </CardHeader>
        <CardContent>
          <div
            v-html="content.content"
            class="text-gray-600 content prose max-w-none"
          ></div>
        </CardContent>
        <CardFooter class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">
            {{ new Date(content.date).toLocaleDateString() }}
          </span>
        </CardFooter>
      </Card>
    </div>
    <div v-else class="text-center w-full flex flex-col gap-4 py-8">
      <div v-if="titelData.length > 0" class="flex flex-col gap-4">
        <div
          v-for="item in titelData"
          :key="item.id"
          class="hover:scale-105 w-full hover:shadow-lg transition-all bg-gray-100 border border-gray-950 rounded-md duration-300"
        >
          <div class="w-full p-4" @click="handleClick(item)">
            <h1 class="text-xl font-semibold text-gray-800">
              {{ item.title }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <section class="mt-12" v-if="titelData.length > 0">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800 0">Нийтлэлүүд</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <template v-for="item in titelData" :key="item.id">
          <a
            v-if="item.contentType === 'list_content'"
            :href="`/list/${item.id}/${item.listId}`"
            class="hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            <Card class="h-full">
              <CardHeader>
                <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                <CardDescription>{{ item.intro }}</CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a
            v-if="item.contentType === 'single_content'"
            :href="`/${item.id}/${item.contentId}`"
            class="hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            <Card class="h-full">
              <CardHeader>
                <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                <!-- <CardDescription>{{ item.intro }}</CardDescription> -->
              </CardHeader>
            </Card>
          </a>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.content :deep(h1, h2, h3, h4, h5, h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.625;
}

.content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.content :deep(ul, ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.content :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
