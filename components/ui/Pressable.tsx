import { colors, radius } from "@/theme/vitrine";
import { ActivityIndicator, Pressable, StyleSheet, Text, type DimensionValue } from "react-native";

type Props = {
  backgroundColor?: string;
  padding?: number;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  marginTop?: number;
  message: string;
  loading?: boolean;
  color?: string;
  onPress: () => void;
};

export default function PressableComponent({
  marginTop = 0, backgroundColor = colors.action, borderRadius = radius.control, width = "100%",
  height = 45, loading = false, message, color = colors.onShell, padding = 10, onPress,
}: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={message}
      accessibilityState={{ busy: loading, disabled: loading }} onPress={onPress} disabled={loading}
      style={({ pressed }) => [styles.button, { backgroundColor, borderRadius, width, minHeight: height, marginTop, padding }, pressed && styles.pressed]}>
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.label, { color }]}>{message}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { justifyContent: "center", alignItems: "center" },
  label: { fontSize: 15, fontWeight: "800", textAlign: "center" },
  pressed: { opacity: 0.82 },
});
