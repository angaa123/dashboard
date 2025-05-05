<template>
  <!-- Modal Overlay -->
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-10 bg-opacity-30 backdrop-blur-sm"
    @click="closeModal"
  ></div>

  <!-- Modal Dialog -->
  <div
    v-if="props.isOpen"
    role="dialog"
    aria-modal="true"
    aria-labelledby="search-dialog-title"
    class="search-dialog fixed top-1/2 left-1/2 z-20 w-screen max-w-[592px] -translate-x-1/2 -translate-y-1/2 transform"
    tabindex="-1"
    @keydown.esc="closeModal"
  >
    <div class="search-dialog-outer-wrapper">
      <div class="search-dialog-middle-wrapper">
        <div class="search-dialog-inner-wrapper">
          <div class="search-content-container">
            <!-- Header / Input Area -->
            <div class="search-input-area">
              <div class="search-input-icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.2"
                    d="m16.3 15.8-3.62-3.62M2.3 7.83c0-3.33 2.7-6.03 6.03-6.03 3.33 0 6.04 2.7 6.04 6.03 0 3.33-2.7 6.04-6.04 6.04-3.33 0-6.03-2.7-6.03-6.04Z"
                  ></path>
                </svg>
                <input
                  v-model="search"
                  @input="onInput"
                  @focus="openDropdown"
                  @keydown.down.prevent="moveSelection(1)"
                  @keydown.up.prevent="moveSelection(-1)"
                  @keydown.enter.prevent="selectResult()"
                  type="text"
                  class="search-input"
                  placeholder="Search help (e.g. integrations, importing, or billing)"
                  ref="inputRef"
                  autocomplete="off"
                  aria-autocomplete="list"
                  :aria-expanded="showDropdown"
                  aria-controls="search-results-listbox"
                  :aria-activedescendant="
                    selectedIndex >= 0
                      ? `result-item-${selectedIndex}`
                      : undefined
                  "
                />
              </div>
              <button
                v-show="search.length > 0"
                @click="clearSearch"
                class="clear-button"
              >
                Clear
              </button>
            </div>

            <!-- Results Area -->
            <div
              class="results-area"
              v-if="
                showDropdown &&
                (results.unique_arr.length || results.titelsResults_arr.length)
              "
            >
              <!-- <p class="results-recommendation-title">Recommended articles</p> -->
              <div
                id="search-results-listbox"
                role="listbox"
                class="results-listbox"
              >
                <div
                  v-for="(item, idx) in allResults"
                  :key="item.id || idx"
                  :id="`result-item-${idx}`"
                  role="option"
                  :aria-selected="idx === selectedIndex"
                  :class="[
                    'dropdown-item',
                    { selected: idx === selectedIndex },
                  ]"
                  @click="selectResult(idx)"
                  @mousedown.prevent="selectResult(idx)"
                  tabindex="-1"
                  title="Click to navigate"
                >
                  <div class="item-content-wrapper">
                    <div class="item-icon">
                      <!-- Placeholder for item icon -->
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                      >
                        <g stroke="currentColor">
                          <path
                            d="M9.25 2.75h-2.5c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 0 0-1.093 1.093C2.75 4.65 2.75 5.35 2.75 6.75v2.5c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092c.535.273 1.235.273 2.635.273h2.5c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.092-1.092c.273-.535.273-1.235.273-2.635v-2.5c0-1.4 0-2.1-.273-2.635a2.5 2.5 0 0 0-1.092-1.093C11.35 2.75 10.65 2.75 9.25 2.75Z"
                            stroke-linecap="round"
                          ></path>
                          <rect
                            x="4.883"
                            y="4.883"
                            width="2.297"
                            height="2.297"
                            rx=".656"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></rect>
                          <path
                            d="M4.883 9.148h6.23M4.883 11.117h3.61"
                            stroke-linecap="round"
                          ></path>
                          <path
                            d="M11.176 2.768a2.145 2.145 0 0 0-.199-.653 2.5 2.5 0 0 0-1.092-1.093C9.35.75 8.637.75 7.212.75c-2.282 0-3.422 0-4.278.436a4 4 0 0 0-1.748 1.748C.75 3.79.75 4.93.75 7.212c0 1.425 0 2.138.272 2.673a2.5 2.5 0 0 0 1.093 1.092c.229.117.488.184.819.222"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div class="item-text-content">
                      <p
                        class="item-title"
                        v-html="highlight(item.title || '')"
                      ></p>
                      <p
                        class="item-snippet"
                        v-if="item.intro || item.content"
                        v-html="highlight(item.intro || item.content || '')"
                      ></p>
                      <div class="item-category" v-if="item.category">
                        <!-- Placeholder for breadcrumbs/category -->
                        <span class="category-segment">Reference</span>
                        <span class="category-separator">/</span>
                        <span class="category-segment">{{
                          item.category
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!allResults.length" class="no-results">
                  No results found.
                </div>
              </div>
            </div>
            <div v-else-if="isLoading" class="results-area text-gray-500">
              <div class="loading-indicator">Loading...</div>
            </div>
            <div
              v-else-if="showDropdown && !allResults.length"
              class="results-area text-gray-500"
            >
              <div class="no-results">No results found.</div>
            </div>

            <!-- Footer / Hints -->
            <div class="search-footer">
              <div class="footer-hints">
                <div class="hint">
                  <div class="hint-keys">
                    <button class="key-button">
                      <svg
                        class="key-icon arrow-up"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.1"
                          d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5"
                        ></path>
                      </svg>
                    </button>
                    <button class="key-button">
                      <svg
                        class="key-icon arrow-down"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.1"
                          d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <span class="hint-text">Navigate</span>
                </div>
                <div class="hint">
                  <div class="hint-keys">
                    <button class="key-button">
                      <svg
                        class="key-icon enter-key"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.5 7.167h6c.552 0 1-.448 1-1V2.5m-7 4.667L4.833 9.5M2.5 7.167 4.833 4.833"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <span class="hint-text">Select</span>
                </div>
              </div>
              <div class="hint">
                <span class="hint-text">Close</span>
                <div class="hint-keys">
                  <button class="key-button">
                    <span class="esc-key-text">esc</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import { useSearch } from "../../composables/useSearch";
import { useRouter } from "vue-router";
import axios from "axios";

// --- Define Props & Emits ---
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
// --- End Props & Emits ---

// Define a type for the search result items
interface SearchResultItem {
  id?: string | number;
  title?: string;
  intro?: string;
  content?: string;
  category?: string;
  [key: string]: any;
}

// --- State for Modal ---
// const isModalOpen = ref(true); // Control modal visibility - set to true to show initially for demo - REMOVED

function closeModal() {
  // isModalOpen.value = false; // REPLACED
  emit("close"); // Emit close event
  closeDropdown(); // Also close dropdown when modal closes
}
// --- End Modal State ---

const router = useRouter();

const { search, onFinalSearch } = useSearch();
const showDropdown = ref(false);
const isLoading = ref(false);
const results = ref<{
  unique_arr: SearchResultItem[];
  titelsResults_arr: SearchResultItem[];
}>({ unique_arr: [], titelsResults_arr: [] });
const selectedIndex = ref(-1);
const inputRef = ref<HTMLInputElement | null>(null);

const allResults = computed<SearchResultItem[]>(() => [
  ...results.value.titelsResults_arr,
  ...results.value.unique_arr,
]);
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
// debounceTimeout()
function onInput() {
  // clearTimeout(100);
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  console.log("search.value", search.value);
  if (search.value.trim() === "") {
    results.value = { unique_arr: [], titelsResults_arr: [] };
    showDropdown.value = false;
    selectedIndex.value = -1;
    return;
  }
  debounceTimeout.value = setTimeout(async () => {
    isLoading.value = true;
    try {
      results.value = await onFinalSearch();
      showDropdown.value = true;
      selectedIndex.value = -1; // Reset selection on new results
    } catch (error) {
      console.error("Search failed:", error);
      results.value = { unique_arr: [], titelsResults_arr: [] }; // Clear results on error
      showDropdown.value = true; // Keep dropdown potentially open to show error/empty state
    } finally {
      isLoading.value = false;
    }
  }, 500);
}

function openDropdown() {
  // Dropdown opens automatically based on input/results in the modal version
  if (search.value.trim() !== "" && allResults.value.length > 0) {
    showDropdown.value = true;
  }
}

function closeDropdown() {
  showDropdown.value = false;
  selectedIndex.value = -1;
}

function clearSearch() {
  search.value = "";
  results.value = { unique_arr: [], titelsResults_arr: [] };
  showDropdown.value = false;
  selectedIndex.value = -1;
  inputRef.value?.focus();
}

function moveSelection(direction: number) {
  if (!showDropdown.value || !allResults.value.length) return;

  const newIndex = selectedIndex.value + direction;

  if (newIndex < 0) {
    selectedIndex.value = allResults.value.length - 1; // Wrap around to last item
  } else if (newIndex >= allResults.value.length) {
    selectedIndex.value = 0; // Wrap around to first item
  } else {
    selectedIndex.value = newIndex;
  }
  // Scroll into view
  nextTick(() => {
    const selectedElement = document.getElementById(
      `result-item-${selectedIndex.value}`
    );
    selectedElement?.scrollIntoView({ block: "nearest" });
  });
}

// --- Add the new navigation functions ---
const navigateToItem = (item: any) => {
  showDropdown.value = false;
  if (item.contentType === "single_content") {
    router.push(`/${item.id}/${item.contentId}`);
  } else if (item.contentType === "list_content") {
    // This case might now be handled by navigateToItem_content,
    // but keep it as a fallback or if used elsewhere.
    router.push(`/list/${item.id}/${item.listId}`);
  } else {
    router.push(`/page/${item.id}/${item.contentId}`);
  }
  closeModal(); // Close modal after navigation attempt
};

const navigateToItem_content = async (item: any) => {
  showDropdown.value = false;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found.");
      // Handle missing token, e.g., redirect to login
      return;
    }
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
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const main_title = response.data.data.list;
    console.log("main_title", main_title);

    if (main_title && main_title.length > 0) {
      // Ensure main_title[0].id exists before using it
      const listIdToUse = main_title[0]?.id;
      if (listIdToUse) {
        router.push(
          `/list/${listIdToUse}/${item.listId}#${encodeURIComponent(
            item.title
          )}`
        );
      } else {
        console.error("ID not found in main_title data", main_title[0]);
        router.push(`/list/${item.id}/${item.listId}`); // Fallback
      }
    } else {
      console.error("No title data found for listId:", item.listId);
      router.push(`/list/${item.id}/${item.listId}`); // Fallback
    }
  } catch (error) {
    console.error("Error fetching title data:", error);
    // Fallback navigation even if API call fails
    router.push(`/list/${item.id}/${item.listId}`);
  }
  closeModal(); // Close modal after navigation attempt
};
// --- End new functions ---

// --- Modify selectResult to use the new functions ---
function selectResult(idx?: number) {
  const index = typeof idx === "number" ? idx : selectedIndex.value;
  if (index >= 0 && index < allResults.value.length) {
    const selectedItem = allResults.value[index];

    // --- Infer contentType if missing ---
    let inferredContentType = selectedItem.contentType;
    if (!inferredContentType) {
      if (selectedItem.listId) {
        // Assuming items with listId are meant for navigateToItem_content
        inferredContentType = "list_content";
      } else if (selectedItem.contentId) {
        // Assuming items with contentId are single pages/content
        // Defaulting to 'page', adjust if 'single_content' is distinct
        inferredContentType = "page";
      } else {
        console.warn("Could not infer content type for item:", selectedItem);
        search.value = selectedItem.title || ""; // Fallback: fill input
        closeModal();
        return; // Stop further processing if type cannot be inferred
      }
      console.log(`Inferred contentType as: ${inferredContentType}`);
    }
    // --- End inference ---

    // Delegate navigation to the appropriate function based on inferred type
    if (inferredContentType === "list_content") {
      navigateToItem_content(selectedItem);
    } else if (
      inferredContentType === "single_content" ||
      inferredContentType === "page"
    ) {
      navigateToItem(selectedItem);
    } else {
      // Optional: Handle originally unknown content types or fallback behavior
      console.warn(
        "Unknown content type provided for navigation:",
        inferredContentType, // Log the type we ended up with
        selectedItem
      );
      search.value = selectedItem.title || ""; // Fallback: fill input
      closeModal(); // Still close modal
    }
    // --- Removed direct navigation logic from here ---
  }
}

function highlight(text: string = ""): string {
  if (!search.value || !text) return text;
  try {
    // Escape special characters for RegExp
    const escapedQuery = search.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    // Use <mark> for semantic highlighting
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  } catch (e) {
    console.error("Regex error in highlight:", e);
    return text; // Return original text if regex fails
  }
}

// Initial focus when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    // Watch the prop instead of the local ref
    if (isOpen) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);

// --- No need for handleClickOutside when using a modal overlay ---
// // Close dropdown on click outside
// watch(showDropdown, (val) => { // REMOVED
//   if (val) { // REMOVED
//     setTimeout(() => { // REMOVED
//       document.addEventListener("click", handleClickOutside); // REMOVED
//     }, 0); // REMOVED
//   } else { // REMOVED
//     document.removeEventListener("click", handleClickOutside); // REMOVED
//   } // REMOVED
// }); // REMOVED

// function handleClickOutside(event: MouseEvent) { // REMOVED
//   if (!(event.target as HTMLElement).closest(".search-container")) { // Adjust selector if needed // REMOVED
//     closeDropdown(); // REMOVED
//   } // REMOVED
// } // REMOVED

// --- Call openModal on mount for demo ---
// onMounted(() => { // REMOVED
//   // openModal(); // Uncomment to open modal automatically when component mounts // REMOVED
// }); // REMOVED
</script>

<style scoped>
/* --- Base Styles --- */
:root {
  /* Define color variables based on the target HTML's classes (guesses) */
  --color-primary-background: #ffffff;
  --color-primary-background-60: rgba(255, 255, 255, 0.6);
  --color-secondary-background: #f9fafb; /* Guess for bg-secondary-background */
  --color-primary-foreground: #1f2937; /* Guess for text-primary-foreground */
  --color-accent-foreground: #6b7280; /* Guess for text-accent-foreground */
  --color-tertiary-foreground: #9ca3af; /* Guess for text-tertiary-foreground */
  --color-weak-stroke: #e5e7eb; /* Guess for border-weak-stroke */
  --color-subtle-stroke: #f3f4f6; /* Guess for border-subtle-stroke */
  --color-surface-subtle: #f3f4f6; /* Guess for bg-surface-subtle (hover/active) */
  --color-link-foreground: #3b82f6; /* Guess for text-link-foreground */
  --color-highlight-bg: #fef08a; /* Current highlight bg */
  --color-highlight-text: #b45309; /* Current highlight text */
  --color-caret: #0f6be9; /* Caret color from example */
  --color-icon-idle: #717a88; /* Icon color from example */
  --color-black-600: #4b5563; /* Guess for text-black-600 */
  --color-black-800: #1f2937; /* Guess for text-black-800 */
  --color-disabled-foreground: #9ca3af; /* Guess for text-disabled-foreground */
}

/* --- Modal Styles --- */
.search-dialog {
  /* fixed top-1/2 left-1/2 z-20 w-screen max-w-[592px] -translate-x-1/2 -translate-y-1/2 */
  /* The positioning is handled by inline styles in the example, applied here */
}

.search-dialog-outer-wrapper {
  /* bg-primary-background/60 rounded-2xl p-0.5 shadow-[...] backdrop-blur-[2px] */
  background-color: var(--color-primary-background-60);
  border-radius: 1rem; /* rounded-2xl */
  padding: 2px; /* p-0.5 */
  box-shadow: 0px 18px 88px -4px rgba(28, 40, 64, 0.14),
    0px 8px 28px -6px rgba(28, 40, 64, 0.12);
  backdrop-filter: blur(2px);
}

.search-dialog-middle-wrapper {
  /* border-weak-stroke rounded-[14px] border */
  border: 1px solid var(--color-weak-stroke);
  border-radius: 14px;
}

.search-dialog-inner-wrapper {
  /* border-white-300 bg-primary-background rounded-[13px] border */
  /* Assuming border-white-300 is a subtle inner border */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Guess */
  background-color: var(--color-primary-background);
  border-radius: 13px;
}

.search-content-container {
  /* flex h-[472px] max-h-[85vh] w-full flex-col */
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 13px;
  height: 472px;
  max-height: 85vh;
  width: 100%; /* Should be constrained by max-w on dialog */
  overflow: hidden; /* Prevent content overflow */
}

/* --- Input Area Styles --- */
.search-input-area {
  /* border-weak-stroke flex items-center border-b pt-[14px] pr-[9px] pb-[13px] pl-[15px] */
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-weak-stroke);
  padding: 14px 9px 13px 15px;
  flex-shrink: 0; /* Prevent shrinking */
}

.search-input-icon-wrapper {
  /* text-accent-foreground flex flex-1 items-center gap-x-2 self-stretch text-sm */
  /* color: var(--color-accent-foreground); */
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem; /* gap-x-2 */
  align-self: stretch;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
}

.search-input-icon-wrapper svg {
  /* color: var(--color-icon-idle); stroke="#717A88" */
  flex-shrink: 0;
}

.search-input {
  /* focus-disable text-primary-foreground placeholder:text-accent-foreground flex-1 self-stretch border-none p-0 text-sm caret-[#0F6BE9] outline-hidden focus:ring-0 */
  /* color: var(--color-primary-foreground); */
  flex: 1;
  align-self: stretch;
  border: none;
  padding: 0;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  caret-color: var(--color-caret);
  outline: none; /* outline-hidden / focus:ring-0 */
  background: transparent; /* Ensure input bg is transparent */
}
.search-input::placeholder {
  color: var(--color-accent-foreground);
  opacity: 1; /* Ensure placeholder is visible */
}
/* Mimic focus:ring-0 */
.search-input:focus {
  box-shadow: none;
  outline: none;
}

.clear-button {
  /* text-accent-foreground rounded-xs px-2 py-0.5 text-xs opacity-0 transition-[box-shadow,opacity] */
  color: var(--color-accent-foreground);
  border-radius: 0.125rem; /* rounded-xs */
  padding: 2px 8px; /* px-2 py-0.5 */
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
  /* opacity is handled by v-show */
  transition: box-shadow 0.3s ease, opacity 0.3s ease;
  margin-left: 8px; /* Add some space */
  background: none;
  border: none;
  cursor: pointer;
}
.clear-button:hover {
  background-color: var(--color-surface-subtle);
}

/* --- Results Area Styles --- */
.results-area {
  /* flex-1 scroll-py-2 overflow-auto py-5 lg:py-2 */
  flex: 1;
  overflow-y: auto;
  padding-top: 0.5rem; /* py-2 (using lg value) */
  padding-bottom: 0.5rem; /* py-2 */
  /* scroll-py-2 might need JS or be inherent */
}

.results-recommendation-title {
  /* text-caption-foreground text-xs lg:hidden */
  color: var(--color-tertiary-foreground); /* Assuming caption = tertiary */
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
  padding: 0 1rem 0.5rem; /* Add some padding */
  /* Hide on larger screens if needed with media query */
  /* @media (min-width: 1024px) { display: none; } */
}

.results-listbox {
  /* relative mt-1.5 flex w-full flex-col items-stretch lg:mt-0 lg:gap-0.5 */
  position: relative;
  margin-top: 0; /* lg:mt-0 */
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 2px; /* lg:gap-0.5 */
}

.dropdown-item {
  /* data-[active-item]:bg-surface-subtle relative inline-block cursor-pointer overflow-hidden rounded-2xl py-2.5 lg:mx-2 lg:px-3 */
  position: relative;
  display: block; /* inline-block behaves oddly here */
  cursor: pointer;
  overflow: hidden;
  border-radius: 1rem; /* rounded-2xl */
  padding: 0.625rem 0.75rem; /* py-2.5 lg:px-3 */
  margin: 0 0.5rem; /* lg:mx-2 */
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease-in-out;
}

.dropdown-item.selected,
.dropdown-item:hover {
  /* data-[active-item]:bg-surface-subtle */
  background-color: var(--color-surface-subtle);
}

.item-content-wrapper {
  /* flex w-full items-start gap-x-2.5 overflow-hidden lg:gap-x-[14px] */
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 14px; /* lg:gap-x-[14px] */
  overflow: hidden;
}

.item-icon {
  /* border-subtle bg-secondary-background text-black-600 mt-0.5 shrink-0 rounded-[10px] border p-[7px] lg:p-2 */
  border: 1px solid var(--color-subtle-stroke);
  background-color: var(--color-secondary-background);
  color: var(--color-black-600);
  margin-top: 2px; /* mt-0.5 */
  flex-shrink: 0;
  border-radius: 10px;
  padding: 8px; /* lg:p-2 */
  display: flex; /* Center icon inside */
  align-items: center;
  justify-content: center;
}
.item-icon svg {
  width: 14px;
  height: 14px;
}

.item-text-content {
  /* flex-1 overflow-hidden */
  flex: 1;
  overflow: hidden;
  min-width: 0; /* Prevent overflow issues in flex */
}

.item-title {
  /* text-primary-foreground [&>mark]:text-link-foreground truncate text-sm [&>mark]:bg-blue-500/10 */
  /* color: var(--color-primary-foreground); */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  font-weight: 600; /* Added for emphasis */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px; /* Adjust spacing */
}

/* Styles for highlighted text within title/snippet */
.item-title :deep(mark.highlight),
.item-snippet :deep(mark.highlight) {
  /* [&>mark]:text-link-foreground [&>mark]:bg-blue-500/10 */
  color: var(--color-link-foreground);
  background-color: rgba(59, 130, 246, 0.1); /* bg-blue-500/10 */
  border-radius: 2px;
  padding: 0 2px;
}

.item-snippet {
  /* text-tertiary-foreground [&>mark]:text-link-foreground mt-0.5 line-clamp-2 text-xs lg:line-clamp-none lg:truncate [&>mark]:bg-blue-500/10 */
  color: var(--color-tertiary-foreground);
  margin-top: 2px; /* mt-0.5 */
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem; /* leading-tight */
  display: -webkit-box;
  -webkit-line-clamp: 1; /* lg:line-clamp-none lg:truncate - simplified to 1 line */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Combined with truncate */
  margin-bottom: 2px; /* Adjust spacing */
}
/* On larger screens, allow more lines or truncate differently if needed */
/* @media (min-width: 1024px) {
  .item-snippet {
     white-space: nowrap;
    -webkit-line-clamp: unset;
  }
} */

.item-category {
  /* mt-0.5 hidden flex-wrap gap-x-[3px] lg:flex */
  margin-top: 2px; /* mt-0.5 */
  /* display: none;  hidden */
  display: flex; /* lg:flex */
  flex-wrap: wrap;
  gap: 3px; /* gap-x-[3px] */
  /* Hide on smaller screens if needed with media query */
  /* @media (max-width: 1023px) { display: none; } */
}

.item-category .category-segment {
  /* text-black-800 text-[10px] leading-4 tracking-normal */
  color: var(--color-black-800);
  font-size: 10px;
  line-height: 1rem; /* leading-4 */
  letter-spacing: normal;
}
.item-category .category-separator {
  /* text-disabled-foreground text-[11px] leading-4 tracking-[-0.22px] */
  color: var(--color-disabled-foreground);
  font-size: 11px;
  line-height: 1rem; /* leading-4 */
  letter-spacing: -0.22px;
}

.no-results {
  padding: 16px;
  color: #9ca3af;
  text-align: center;
  font-size: 0.875rem;
}

.loading-indicator {
  padding: 16px;
  color: #6b7280;
  text-align: center;
  font-size: 0.875rem;
}

/* --- Footer Styles --- */
.search-footer {
  /* border-weak-stroke bg-secondary-background flex justify-between gap-x-4 rounded-b-[13px] border-t px-4 pt-[11px] pb-[10px] */
  border-top: 1px solid var(--color-weak-stroke);
  background-color: var(--color-secondary-background);
  display: flex;
  justify-content: space-between;
  gap: 1rem; /* gap-x-4 */
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  padding: 11px 16px 10px; /* px-4 pt-[11px] pb-[10px] */
  flex-shrink: 0; /* Prevent shrinking */
}

.footer-hints {
  /* flex gap-x-4 */
  display: flex;
  gap: 1rem; /* gap-x-4 */
}

.hint {
  /* flex items-center gap-x-1.5 text-[#717A88] */
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-x-1.5 */
  color: var(--color-icon-idle);
}

.hint-keys {
  /* flex gap-x-1 */
  display: flex;
  gap: 0.25rem; /* gap-x-1 */
}

.key-button {
  /* focus-disable border-subtle-stroke bg-primary-background flex min-h-[22px] min-w-[22px] items-center justify-center rounded-md border-x border-t border-b-2 px-1 pt-[3px] pb-0.5 shadow-[...] outline-hidden transition-[...] active:translate-y-px active:border-[#D3D8DF] active:shadow-[...] focus-visible:border-[#B5BDC9] focus-visible:shadow-[...] focus-visible:active:shadow[...] */
  background-color: var(--color-primary-background);
  border: 1px solid var(--color-subtle-stroke);
  border-bottom-width: 2px;
  border-bottom-color: #e4e7ec; /* Shadow color guess */
  min-height: 22px;
  min-width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem; /* rounded-md */
  padding: 3px 4px 2px; /* px-1 pt-[3px] pb-0.5 */
  box-shadow: 0px 1px 0px 1px #e4e7ec;
  outline: none;
  transition: box-shadow 0.1s ease-out, transform 0.1s ease-out,
    border-color 0.1s ease-out;
  color: var(--color-icon-idle);
}
.key-button:active {
  transform: translateY(1px);
  border-color: #d3d8df;
  box-shadow: 0px 0px 0px 1px #e4e7ec;
}
/* Focus visible state would ideally use :focus-visible pseudo-class */
.key-button:focus {
  /* Simplified focus */
  border-color: #b5bdc9;
  box-shadow: 0px 1px 0px 1px #b5bdc9;
}

.key-icon {
  /* h-3 w-3 */
  width: 0.75rem; /* 12px */
  height: 0.75rem; /* 12px */
}
.arrow-up {
  transform: rotate(-90deg);
}
.arrow-down {
  transform: rotate(90deg);
}
/* enter-key specific style if needed */
.enter-key {
}

.esc-key-text {
  /* text-accent-foreground text-xs leading-3 */
  color: var(--color-accent-foreground);
  font-size: 0.75rem; /* text-xs */
  line-height: 0.75rem; /* leading-3 */
  font-family: monospace; /* Often used for keys */
}

.hint-text {
  /* text-xs */
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
}

/* Global highlight style (within <mark>) */
:deep(mark.highlight) {
  background: var(--color-highlight-bg);
  color: var(--color-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
}
</style>
