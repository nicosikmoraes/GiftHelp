import InputComponent, { type InputProps } from "./Input";

export default function TextAreaComponent({ height = 100, ...props }: InputProps) {
  return <InputComponent multiline textAlignVertical="top" height={height} {...props} />;
}
