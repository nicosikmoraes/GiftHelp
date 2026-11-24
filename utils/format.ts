export function formatCurrency(value?: number) {
  if (value == null || !Number.isFinite(value)) return "-";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
