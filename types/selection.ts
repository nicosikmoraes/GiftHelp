export type SelectionOption = { label: string; value: string };
export type CatalogOption = { label: string; value: string | number };

export function normalizeOptions(options: CatalogOption[]): SelectionOption[] {
  return options.map(({ label, value }) => ({ label, value: String(value) }));
}
