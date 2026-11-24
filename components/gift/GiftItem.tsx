import { colors, radius } from "@/theme/vitrine";
import type { Gift } from "@/services/gift";
import { Pressable, StyleSheet, Text } from "react-native";
import GiftArt from "./GiftArt";

export default function GiftItem({ gift, onPress }: { gift: Gift; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <GiftArt type={gift.type} />
      <Text style={styles.name} numberOfLines={2}>{gift.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 0, minHeight: 82, padding: 4, gap: 4, borderWidth: 1, borderColor: colors.line, borderRadius: radius.control, backgroundColor: colors.surface },
  name: { color: colors.ink, fontSize: 13, fontWeight: "700", paddingHorizontal: 4, paddingBottom: 3 },
  pressed: { backgroundColor: colors.tint, transform: [{ scale: 0.98 }] },
});
