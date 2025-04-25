import axios from "axios";
import { ref } from "vue";

export function useSearch() {
  const search = ref("");

  const search_titels = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Task/WebPages`,
        {
          pageSize: 5,
          pageNumber: 1,
          FILTERS: [
            {
              COLUMN: "title",
              OPERATOR: "contains",
              VALUE: search.value,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const search_titel_res = response.data.data.list as any;
        console.log("titels", search_titel_res);
        return search_titel_res || [];
      }
      return [];
    } catch (error) {
      console.error("Error in search_titels:", error);
      return [];
    }
  };

  const search_content_content = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Task/WebItemDetails`,
        {
          pageSize: 20,
          pageNumber: 1,
          FILTERS: [
            {
              COLUMN: "content",
              OPERATOR: "contains",
              VALUE: search.value,
            },
          ],
          sortFields: [{ field: "viewCount", descending: true }],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const search_content_content_res = response.data.data.list as any;
        return search_content_content_res || [];
      }
      return [];
    } catch (error) {
      console.error("Error in search_content_content:", error);
      return [];
    }
  };

  const search_content_titel = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Task/WebItemDetails`,
        {
          pageSize: 20,
          pageNumber: 1,
          FILTERS: [
            {
              COLUMN: "title",
              OPERATOR: "contains",
              VALUE: search.value,
            },
          ],
          sortFields: [{ field: "viewCount", descending: true }],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const search_content_titel_res = response.data.data.list as any;
        return search_content_titel_res || [];
      }
      return [];
    } catch (error) {
      console.error("Error in search_content_titel:", error);
      return [];
    }
  };

  const search_content_intro = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/Task/WebItemDetails`,
        {
          pageSize: 20,
          pageNumber: 1,
          FILTERS: [
            {
              COLUMN: "intro",
              OPERATOR: "contains",
              VALUE: search.value,
            },
          ],
          sortFields: [{ field: "viewCount", descending: true }],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Check if response.data and response.data.data exist before accessing list
      if (response.data && response.data.data) {
        const search_content_intro_res = response.data.data.list as any;
        return search_content_intro_res || [];
      }
      return [];
    } catch (error) {
      console.error("Error in search_content_intro:", error);
      return [];
    }
  };

  const onFinalSearch = async () => {
    if (search.value.length > 3) {
      const contentResults = await search_content_content();
      const introResults = await search_content_intro();
      const contentTitelResults = await search_content_titel();
      const titelsResults = await search_titels();

      // Combine all results
      const allResults = [
        ...(contentResults || []),
        ...(introResults || []),
        ...(contentTitelResults || []),
      ];
      const titelsResults_arr = [...titelsResults];

      // Remove duplicates
      return remove_dobled(allResults, titelsResults_arr);
    }
    return { unique_arr: [], titelsResults_arr: [] };
  };

  const remove_dobled = (arr: any[], titelsResults_arr: any[]) => {
    if (!arr || arr.length === 0) return { unique_arr: [], titelsResults_arr };

    const unique_arr = arr.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
    console.log("unique_arr", unique_arr);
    return { unique_arr, titelsResults_arr };
  };

  return {
    search,
    onFinalSearch,
  };
}
