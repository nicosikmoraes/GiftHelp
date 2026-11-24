import { colors, layout, serif, space } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type HeaderAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export default function Header({ back, action }: { back?: () => void; action?: HeaderAction }) {
  const controls = [
    ...(back ? [{ icon: "arrow-back" as const, label: "Voltar", onPress: back }] : []),
    ...(action ? [action] : []),
  ];
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.mark} accessible={false}><Ionicons name="gift-outline" size={17} color={colors.onAccent} /></View>
        <Text style={styles.name}>Laço<Text style={styles.period}>.</Text></Text>
      </View>
      <View style={styles.actions}>
        {controls.map(({ icon, label, onPress }) => (
          <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Ionicons name={icon} size={19} color={colors.onShell} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function backTo(fallback: "/login" | "/(auth)/home") {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

const styles = StyleSheet.create({
  header: { minHeight: 55, width: "100%", paddingHorizontal: space.page, alignSelf: "center", maxWidth: layout.contentWidth, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 7 },
  mark: { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  name: { color: colors.onShell, fontFamily: serif, fontSize: 29, letterSpacing: -1 },
  period: { color: colors.accent },
  actions: { flexDirection: "row", gap: space.compact },
  button: { width: layout.controlHeight, height: layout.controlHeight, borderRadius: 22, borderWidth: 1, borderColor: colors.shellLine, alignItems: "center", justifyContent: "center" },
  pressed: { backgroundColor: colors.shellLine },
});
