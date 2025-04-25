<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { Dot } from "lucide-vue-next";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
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
// const router = useRouter();
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
//////////////

// Map to store children for each parent item
const childrenMap = ref<Record<number, TitelDataItem[]>>({});

const loadChildrenForItem = async (parentId: number) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/Task/WebPages`,
      {
        pageSize: 50,
        pageNumber: 1,
        FILTERS: [
          {
            COLUMN: "pid",
            OPERATOR: "IS",
            VALUE: parentId,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    childrenMap.value[parentId] = response.data.data.list;
  } catch (error) {
    console.error(`Error loading children for item ${parentId}:`, error);
    childrenMap.value[parentId] = [];
  }
};

// Load children for a specific item when hovering
const handleItemHover = async (item: TitelDataItem) => {
  if (!childrenMap.value[item.id]) {
    await loadChildrenForItem(item.id);
  }
};

// Load children for all items
const loadAllChildData = async () => {
  for (const item of titelData.value) {
    await loadChildrenForItem(item.id);
  }
};

// Watch for when titelData is populated and load children for all items
watch(
  titelData,
  async (newValue) => {
    if (newValue.length > 0) {
      await loadAllChildData();
    }
  },
  { immediate: true }
);

// Watch for route parameter changes to refresh data
watch(
  [cont_id, titel_id],
  ([newContId, newTitelId], [oldContId, oldTitelId]) => {
    if (newContId !== oldContId || newTitelId !== oldTitelId) {
      getContent();
      titelData2();
      // Reset children map when route changes
      childrenMap.value = {};
    }
  },
  { immediate: true }
);
</script>

<template>
  <section class="mt-12" v-if="titelData.length > 0">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <template v-for="item in titelData" :key="item.id">
        <a
          v-if="item.contentType === 'list_content'"
          :href="`/list/${item.id}/${item.listId}`"
          class="hover:scale-105 hover:shadow-lg transition-all duration-300"
          @mouseenter="handleItemHover(item)"
        >
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="text-lg"
                >{{ item.title
                }}<span
                  class="text-sm text-orange-300"
                  v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
                  >({{ childrenMap[item.id].length }})</span
                ></CardTitle
              >
              <CardDescription>{{ item.intro }}</CardDescription>
            </CardHeader>
            <CardContent
              v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
              class="max-h-20 overflow-y-auto group-hover:block hidden"
            >
              <div
                v-for="child in childrenMap[item.id]"
                :key="child.id"
                class="text-sm mb-1 flex items-center gap-2"
              >
                <div class="w-4 h-4">
                  <Dot class="w-4 h-4" />
                </div>
                {{ child.title }}
              </div>
            </CardContent>
          </Card>
        </a>
        <a
          v-if="item.contentType === 'single_content'"
          :href="`/${item.id}/${item.contentId}`"
          class="hover:scale-105 hover:shadow-lg transition-all duration-300"
          @mouseenter="handleItemHover(item)"
        >
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="text-lg"
                >{{ item.title
                }}<span
                  class="text-sm text-orange-300"
                  v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
                  >({{ childrenMap[item.id].length }})</span
                ></CardTitle
              >
              <CardDescription>{{ item.intro }}</CardDescription>
            </CardHeader>
            <CardContent
              v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
              class="max-h-20 overflow-y-auto group-hover:block hidden"
            >
              <div
                v-for="child in childrenMap[item.id]"
                :key="child.id"
                class="text-sm mb-1 flex items-center gap-2"
              >
                <div class="w-4 h-4">
                  <Dot class="w-4 h-4" />
                </div>
                {{ child.title }}
              </div>
            </CardContent>
          </Card>
        </a>
        <a
          v-if="item.contentType === 'cpta_aboutus'"
          :href="`/page/${item.id}/${item.listId}`"
          class="hover:scale-105 hover:shadow-lg transition-all duration-300"
          @mouseenter="handleItemHover(item)"
        >
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="text-lg"
                >{{ item.title
                }}<span
                  v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
                  class="text-sm text-orange-300"
                  >({{ childrenMap[item.id].length }})</span
                ></CardTitle
              >
              <CardDescription>{{ item.intro }}</CardDescription>
            </CardHeader>
            <CardContent
              v-if="childrenMap[item.id] && childrenMap[item.id].length > 0"
              class="max-h-20 overflow-y-auto group-hover:block hidden"
            >
              <div
                v-for="child in childrenMap[item.id]"
                :key="child.id"
                class="text-sm mb-1 flex items-center gap-2"
              >
                <div class="w-4 h-4">
                  <Dot class="w-4 h-4" />
                </div>
                {{ child.title }}
              </div>
            </CardContent>
          </Card>
        </a>
      </template>
    </div>
  </section>
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
