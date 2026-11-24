import BlankTemplate from "@/components/template/Blank";
import { colors, serif } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function Events() {
  return (
    <BlankTemplate>
      <View style={styles.body}>
        <View style={styles.icon}><Ionicons name="calendar-outline" color={colors.action} size={24} /></View>
        <Text accessibilityRole="header" style={styles.title}>Eventos</Text>
      </View>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  icon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.tint, alignItems: "center", justifyContent: "center" },
  title: { color: colors.onShell, fontFamily: serif, fontSize: 29 },
});
