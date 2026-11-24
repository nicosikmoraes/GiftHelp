import { api } from "./api";
import { normalizeOptions, type CatalogOption, type SelectionOption } from "@/types/selection";

export type Gift = {
  id: number;
  name: string;
  type: string;
  price?: number | string | null;
  description?: string | null;
  color?: string | null;
  quantity?: number | null;
  is_purchased?: boolean;
};

export type CreateGiftPayload = {
  name: string;
  type: string;
  color?: string;
  price?: number;
  quantity?: number;
  description?: string;
};

export async function createGift(payload: CreateGiftPayload) {
  const response = await api.post("/gifts/create", payload);
  return response.data;
}

export async function getGiftTypes(signal?: AbortSignal): Promise<SelectionOption[]> {
  const response = await api.get<CatalogOption[]>("/gifts/type", { signal });
  return normalizeOptions(response.data);
}

export async function getUserGifts(signal?: AbortSignal) {
  const response = await api.get<Gift[]>("/gifts", { signal });
  return response.data;
}

export async function markAsPurchased(id: number) {
  const response = await api.patch(`/gifts/${id}/purchase`);
  return response.data;
}
