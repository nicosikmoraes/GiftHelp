import { colors, layout } from "@/theme/vitrine";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterDefault from "./FooterDefault";
import Header, { backTo, type HeaderAction } from "./Header";

type Props = { children: ReactNode; action?: HeaderAction; back?: boolean };

export default function BlankTemplate({ children, action, back }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Header action={action} back={back ? () => backTo("/(auth)/home") : undefined} />
      <View style={styles.content}>{children}</View>
      <FooterDefault />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.shell },
  content: { flex: 1, width: "100%", maxWidth: layout.contentWidth, alignSelf: "center" },
});
