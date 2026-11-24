import { colors, serif } from "@/theme/vitrine";
import { StyleSheet, Text, type TextStyle } from "react-native";

type Props = { fontSize?: number; message: string; color?: string; variant?: "serif" | "sans"; align?: TextStyle["textAlign"] };

export default function TitleComponent({ fontSize = 24, message, color = colors.ink, variant = "serif", align }: Props) {
  return <Text accessibilityRole="header" style={[styles[variant], { fontSize, color }, align && { textAlign: align }]}>{message}</Text>;
}

const styles = StyleSheet.create({
  serif: { fontFamily: serif, letterSpacing: -0.5 },
  sans: { fontWeight: "800", letterSpacing: -1.15, textAlign: "center" },
});
