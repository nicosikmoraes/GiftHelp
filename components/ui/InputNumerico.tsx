import InputComponent, { type InputProps } from "./Input";

type Props = InputProps & { amount?: number; currency?: boolean };

export default function InputNumberComponent({ amount = 2, currency = false, onChangeText, ...props }: Props) {
  function change(text: string) {
    const digits = text.replace(/\D/g, "");
    if (currency) {
      onChangeText?.(digits ? (Number(digits.slice(0, amount)) / 100).toLocaleString("pt-BR", {
        style: "currency", currency: "BRL",
      }) : "");
    } else {
      onChangeText?.(digits.slice(0, amount).replace(/^0+(\d)/, "$1"));
    }
  }
  return <InputComponent keyboardType="numeric" {...props} onChangeText={change} />;
}
