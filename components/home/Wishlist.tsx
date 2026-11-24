import GiftItem from "@/components/gift/GiftItem";
import GiftModal from "@/components/gift/GiftModal";
import { getUserGifts, type Gift } from "@/services/gift";
import { colors, radius, serif, space } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

const pageSize = 5;

export default function Wishlist() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const purchased = useRef(new Set<number>());

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setStatus("loading");
    getUserGifts(controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      setGifts(data.filter((gift) => !gift.is_purchased && !purchased.current.has(gift.id)));
      setStatus("ready");
    }).catch(() => {
      if (!controller.signal.aborted) setStatus("error");
    });
    return () => controller.abort();
  }, [attempt]));

  const tiles: (Gift | "add")[] = gifts.slice(0, visibleCount);
  tiles.splice(3, 0, "add");
  const rows = [];
  for (let index = 0; index < tiles.length; index += 2) rows.push(tiles.slice(index, index + 2));
  const hasMore = gifts.length > visibleCount;

  function markPurchased(id: number) {
    purchased.current.add(id);
    setGifts((previous) => previous.filter((gift) => gift.id !== id));
    setSelectedGift((previous) => previous?.id === id ? null : previous);
  }

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>Lista de desejos</Text>
      {status === "loading" && gifts.length === 0 && <ActivityIndicator color={colors.action} accessibilityLabel="Carregando a lista" />}
      {status === "error" && <Pressable accessibilityRole="button" onPress={() => setAttempt((last) => last + 1)} style={styles.link}>
        <Text style={styles.linkText}>Tentar carregar a lista</Text>
      </Pressable>}
      {status === "ready" && gifts.length === 0 && <Text style={styles.empty}>Sua lista está vazia.</Text>}
      {rows.map((row, index) => <View key={index} style={styles.row}>
        {row.map((tile) => tile === "add"
          ? <Pressable key="add" accessibilityRole="button" onPress={() => router.push("/(auth)/details/wishlist")}
              style={({ pressed }) => [styles.add, pressed && styles.addPressed]}>
              <View style={styles.plus}><Ionicons name="add" size={18} color={colors.action} /></View>
              <Text style={styles.addText}>Novo presente</Text>
            </Pressable>
          : <GiftItem key={tile.id} gift={tile} onPress={() => setSelectedGift(tile)} />)}
        {row.length === 1 && row[0] !== "add" && <View style={styles.spacer} />}
      </View>)}
      {gifts.length > pageSize && <Pressable accessibilityRole="button" style={styles.link}
        onPress={() => setVisibleCount((last) => hasMore ? last + pageSize : pageSize)}>
        <Text style={styles.linkText}>{hasMore ? "Ver mais" : "Ver menos"}</Text>
      </Pressable>}
      {selectedGift && <GiftModal key={selectedGift.id} gift={selectedGift} onClose={() => setSelectedGift(null)} onPurchased={markPurchased} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.card, padding: 11, gap: 7 },
  title: { fontFamily: serif, color: colors.ink, fontSize: 26, marginBottom: 2 },
  row: { flexDirection: "row", gap: 7 },
  spacer: { flex: 1 },
  empty: { color: colors.muted },
  add: { flex: 1, minHeight: 82, minWidth: 0, alignItems: "center", justifyContent: "center", gap: 4, padding: 5, borderRadius: radius.control, borderWidth: 1, borderStyle: "dashed", borderColor: "#ba8268", backgroundColor: colors.tint },
  addPressed: { backgroundColor: "#efd3bd", transform: [{ scale: 0.98 }] },
  plus: { width: 27, height: 27, borderRadius: 14, backgroundColor: "#efd0bc", alignItems: "center", justifyContent: "center" },
  addText: { color: colors.action, fontWeight: "800", textAlign: "center", fontSize: 13 },
  link: { minHeight: 44, justifyContent: "center", alignItems: "center" },
  linkText: { color: colors.action, fontWeight: "800" },
});
