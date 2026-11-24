import { colors } from "@/theme/vitrine";
import { StyleSheet, Text } from "react-native";

export default function ErrorComponent({ message }: { message: string }) {
  return <Text accessibilityRole="alert" style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({ error: { marginTop: 4, color: colors.danger, fontSize: 12, fontWeight: "600" } });
