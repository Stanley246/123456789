export type CategoryId = "text" | "image" | "developer" | "creator" | "ai" | "finance" | "utility";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface Tool {
  id: string;
  name: string;
  categoryId: CategoryId;
  icon: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  instructions: string[];
}
