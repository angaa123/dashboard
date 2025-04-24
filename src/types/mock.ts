// import type { HtmlHTMLAttributes } from "vue";

export interface MockListItem {
  groupId: number;
  id: number;
  relatedPageId: number;
  title: string;
  date: string;
  content?: string;
  intro: string;
  listId: number;
  cdnUrl: string;
  viewCount?: number;
  defaultAttachUrl: string | null;
}

export interface MockData {
  list: MockListItem[];
}

export interface TitelItem {
  groupId: number;
  id: number;
  pid: number | null;
  title: string;
  code: number;
  intro: string | null;
  pageKey: string | null;
  isFullPage: number;
  isShowMenu: number;
  isWeb5: number;
  url: string | null;
  order: number;
  contentId: number | null;
  listId: number | null;
  contentType: "single_page" | "list_page" | "jump_url";
  cdnUrl: string;
  defaultAttachUrl: string | null;
}

export interface TitelData {
  list: TitelItem[];
}
