<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
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
import { ref } from "vue";

const route = useRoute();
const cont_id = computed(() => route.params.cont_id);

// Find the content by contentId
// const content = computed<MockListItem | undefined>(() => {
//   return apimockdata.list.find((item) => item.id === Number(cont_id.value));
// });
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
</script>

<template>
  <div class="container mx-auto py-8">
    {{ content?.intro }}
    <Card v-if="content" class="mx-auto">
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
          class="w-full h-auto"
        />
      </CardHeader>
      <CardContent>
        <div
          v-html="content.content"
          class="text-gray-600 dark:text-gray-300"
        ></div>
      </CardContent>
      <CardFooter class="flex justify-between items-center">
        <span class="text-sm text-muted-foreground">
          {{ new Date(content.date).toLocaleDateString() }}
        </span>
        <span class="text-sm text-muted-foreground">
          Views: {{ content.viewCount }}
        </span>
      </CardFooter>
    </Card>
    <div v-else class="text-center py-8">
      <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-300">
        Content not found
      </h2>
    </div>
  </div>
</template>

<style scoped></style>
