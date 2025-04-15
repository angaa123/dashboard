<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apimockdata from "@/components/mockdata/apimockdata.json";
import titelData from "@/components/mockdata/titel.json";
import type { MockListItem, TitelItem } from "@/types/mock";
// import { nextTick } from "vue";
// import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();
const list_id = computed(() => route.params.list_id);

// Find the list title from titel data
const titelItem = computed(() => {
  return titelData.list.find(
    (item) => item.listId === Number(list_id.value)
  ) as TitelItem | undefined;
});

const listTitle = computed<string>(() => {
  return titelItem.value?.title || `List ${list_id.value}`;
});

const listIntro = computed<string>(() => {
  return titelItem.value?.intro || `List ${list_id.value}`;
});

const listBg = computed<string>(() => {
  return `${titelItem.value?.cdnUrl}${titelItem.value?.defaultAttachUrl}`;
});

// Filter items based on list_id
const items = computed<MockListItem[]>(() => {
  return apimockdata.list.filter(
    (item) => item.listId === Number(list_id.value)
  );
});

const handleCardClick = (item: MockListItem) => {
  router.push(`/${item.id}`);
};
</script>

<template>
  <div class="container py-8">
    <h1 class="text-4xl text-center md:text-8xl font-bold mb-8">
      {{ listTitle }}
    </h1>
    <div
      v-if="titelItem?.cdnUrl && titelItem?.defaultAttachUrl"
      class="relative"
    >
      <img :src="listBg" alt="list-bg" class="w-full h-auto" />
    </div>
    <p
      class="text-gray-800 pb-8 text-2xl md:text-4xl dark:text-gray-300 text-center"
    >
      {{ listIntro }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="item in items"
        :key="item.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="handleCardClick(item)"
      >
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
          <CardDescription>{{ item.intro }}</CardDescription>
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
          <span class="text-sm text-muted-foreground">
            Views: {{ item.viewCount }}
          </span>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>
