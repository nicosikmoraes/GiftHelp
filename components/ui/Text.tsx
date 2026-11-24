import { colors } from "@/theme/vitrine";
import { Text, type TextStyle } from "react-native";

type Props = {
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  message?: string;
  opacity?: number;
  textAlign?: TextStyle["textAlign"];
  onPress?: () => void;
};

export default function TextComponent({
  color = colors.ink, fontSize = 14, fontWeight = "400", opacity = 1,
  textAlign = "center", message, onPress,
}: Props) {
  return <Text onPress={onPress} accessibilityRole={onPress ? "link" : undefined}
    style={{ color, fontSize, fontWeight, opacity, textAlign }}>{message}</Text>;
}
