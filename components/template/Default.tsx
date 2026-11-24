import { colors, layout, radius, space } from "@/theme/vitrine";
import { usePathname } from "expo-router";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header, { backTo } from "./Header";

export default function CenteredTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <SafeAreaView style={styles.container}>
      <Header back={pathname !== "/login" ? () => backTo("/login") : undefined} />
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.shell },
  keyboard: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: space.page },
  content: { width: "100%", maxWidth: layout.contentWidth - 60, paddingVertical: 30, paddingHorizontal: space.panel, alignSelf: "center", alignItems: "center", gap: space.gap, borderRadius: radius.sheet, backgroundColor: colors.paper },
});
