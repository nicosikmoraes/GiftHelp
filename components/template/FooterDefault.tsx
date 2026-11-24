import { colors, layout, space } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const tabs = [
  { label: "Perfil", icon: "person-outline", href: "/(auth)/home", path: "/home" },
  { label: "Eventos", icon: "calendar-outline", href: "/(auth)/events", path: "/events" },
] as const;

export default function FooterDefault() {
  const pathname = usePathname();
  return (
    <View style={styles.footer}>
      {tabs.map(({ label, icon, href, path }) => {
        const selected = pathname === path || (path === "/home" && pathname.startsWith("/details/"));
        return (
          <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected }}
            onPress={() => { if (pathname !== path) router.replace(href); }}
            style={({ pressed }) => [styles.tab, (selected || pressed) && styles.selected]}>
            <Ionicons name={icon} size={17} color={colors.onShell} />
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: "row", justifyContent: "center", borderTopWidth: 1, borderTopColor: colors.shellLine, padding: 6, gap: space.compact },
  tab: { flex: 1, maxWidth: 145, minHeight: layout.controlHeight, borderRadius: 11, gap: 6, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  selected: { backgroundColor: colors.shellLine },
  label: { color: colors.onShell, fontWeight: "700", fontSize: 13 },
});
