import Button from "@/components/ui/Pressable";
import Sheet from "@/components/ui/Sheet";
import { markAsPurchased, type Gift } from "@/services/gift";
import { colors, radius, serif, space } from "@/theme/vitrine";
import { formatCurrency } from "@/utils/format";
import { showToast } from "@/utils/toast";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GiftArt from "./GiftArt";

type Props = { gift: Gift; onClose: () => void; onPurchased: (id: number) => void };

export default function GiftModal({ gift, onClose, onPurchased }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function purchase() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await markAsPurchased(gift.id);
      onPurchased(gift.id);
      showToast("Presente marcado como comprado", "success");
    } catch {
      setError("Não foi possível atualizar o presente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const price = gift.price == null || gift.price === "" ? null : Number(gift.price);
  const facts = [
    { label: "Preço estimado", value: price !== null && Number.isFinite(price) ? formatCurrency(price) : null },
    { label: "Cor", value: gift.color },
    { label: "Quantidade", value: gift.quantity && gift.quantity > 1 ? gift.quantity : null },
  ].filter(({ value }) => value != null && value !== "");

  return (
    <Sheet visible title="Presente" onClose={() => { if (!loading) onClose(); }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={styles.art}><GiftArt type={gift.type} /></View>
          <View style={styles.nameBlock}>
            <Text style={styles.category}>{gift.type}</Text>
            <Text accessibilityRole="header" style={styles.name}>{gift.name}</Text>
          </View>
        </View>
        {facts.length > 0 && <View style={styles.facts}>
          {facts.map(({ label, value }) => <View key={label} style={styles.fact}>
            <Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text>
          </View>)}
        </View>}
        {gift.description ? <Text style={styles.description}>{gift.description}</Text> : null}
        {error !== "" && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Button message="Marcar como comprado" loading={loading} onPress={purchase} />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  scroll: { flexShrink: 1 },
  content: { gap: space.gap, paddingBottom: 3 },
  summary: { alignItems: "center", flexDirection: "row", gap: space.gap, paddingBottom: space.gap, borderBottomWidth: 1, borderColor: colors.line },
  art: { width: 68, height: 63 },
  nameBlock: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontFamily: serif, fontSize: 24, color: colors.ink },
  category: { color: colors.action, textTransform: "uppercase", fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: space.compact },
  fact: { flex: 1, minWidth: 93, borderRadius: radius.control, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.field, padding: 8 },
  label: { color: colors.muted, fontSize: 12 },
  value: { color: colors.ink, fontWeight: "800", marginTop: 3 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { color: colors.danger },
});
