import { api } from "./api";
import { normalizeOptions, type CatalogOption, type SelectionOption } from "@/types/selection";

export type ColorOption = SelectionOption;

export async function getColors(signal?: AbortSignal): Promise<ColorOption[]> {
  const response = await api.get<CatalogOption[]>("/colors", { signal });
  return normalizeOptions(response.data);
}
