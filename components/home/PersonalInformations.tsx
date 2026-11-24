import InputNumber from "@/components/ui/InputNumerico";
import SelectModal from "@/components/ui/ModalSelect";
import Button from "@/components/ui/Pressable";
import Sheet from "@/components/ui/Sheet";
import { useAuth } from "@/hooks/useAuth";
import type { ColorOption } from "@/services/color";
import { updateUser } from "@/services/user";
import { colors, radius, serif, space } from "@/theme/vitrine";
import type { User } from "@/types/user";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const shirtSizes = ["PP", "P", "M", "G", "GG"].map((value) => ({ label: value, value }));

function preferencesFor(user: User | null) {
  return {
    shirt_size: user?.shirt_size ?? "",
    pants_size: String(user?.pants_size ?? ""),
    shoe_size: String(user?.shoe_size ?? ""),
    ring_size: String(user?.ring_size ?? ""),
    preferred_color: String(user?.preferred_color ?? ""),
  };
}

type Props = {
  colorOptions: ColorOption[];
  catalog: "loading" | "ready" | "error";
  favoriteColor?: string;
  retryColors: () => void;
};

export default function PersonalInformations({ colorOptions, catalog, favoriteColor, retryColors }: Props) {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => preferencesFor(user));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function edit() {
    setForm(preferencesFor(user));
    setError("");
    setOpen(true);
  }

  async function save() {
    if (!user || saving) return;
    setSaving(true);
    setError("");
    const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ""));
    try {
      const updated = await updateUser(payload);
      setUser({ ...user, ...payload, ...updated });
      setOpen(false);
      showToast("Preferências salvas", "success");
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const facts = [
    { label: "Camiseta", value: user?.shirt_size },
    { label: "Calçado", value: user?.shoe_size },
    { label: "Cor favorita", value: favoriteColor },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>Preferências</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Editar preferências" onPress={edit}
          style={({ pressed }) => [styles.edit, pressed && styles.pressed]}>
          <Text style={styles.editText}>Editar</Text><Ionicons name="pencil-outline" size={14} color={colors.action} />
        </Pressable>
      </View>
      <View style={styles.facts}>
        {facts.map(({ label, value }, index) => (
          <View key={label} style={[styles.fact, index === 2 && styles.colorFact, index > 0 && styles.factDivider]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || "—"}</Text>
          </View>
        ))}
      </View>
      <Sheet visible={open} title="Preferências" onClose={() => { if (!saving) setOpen(false); }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
          <View style={styles.row}>
            <View style={styles.field}><SelectModal options={shirtSizes} label="Camiseta" value={form.shirt_size} onChange={(shirt_size) => setForm((last) => ({ ...last, shirt_size }))} /></View>
            <View style={styles.field}><InputNumber label="Calçado" value={form.shoe_size} onChangeText={(shoe_size) => setForm((last) => ({ ...last, shoe_size }))} /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.field}><InputNumber label="Calça" value={form.pants_size} onChangeText={(pants_size) => setForm((last) => ({ ...last, pants_size }))} /></View>
            <View style={styles.field}><InputNumber label="Anel" value={form.ring_size} onChangeText={(ring_size) => setForm((last) => ({ ...last, ring_size }))} /></View>
          </View>
          {catalog === "ready"
            ? <SelectModal options={colorOptions} label="Cor favorita" value={form.preferred_color} onChange={(preferred_color) => setForm((last) => ({ ...last, preferred_color }))} />
            : <Text style={styles.label} accessibilityLiveRegion="polite">{catalog === "loading" ? "Carregando cores…" : "Não foi possível carregar as cores."}</Text>}
          {catalog === "error" && <Pressable accessibilityRole="button" onPress={retryColors} style={styles.edit}><Text style={styles.editText}>Tentar carregar cores</Text></Pressable>}
          {error !== "" && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Button message="Salvar preferências" loading={saving} onPress={save} />
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.card, paddingHorizontal: space.gap, paddingBottom: 12 },
  heading: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { fontFamily: serif, fontSize: 26, color: colors.ink, flexShrink: 1 },
  edit: { minHeight: 44, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 6, gap: 5, borderRadius: radius.control },
  editText: { color: colors.action, fontWeight: "800", fontSize: 13 },
  pressed: { backgroundColor: colors.tint },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  fact: { flex: 1, minWidth: 62, padding: 4 },
  colorFact: { flex: 1.4, minWidth: 86 },
  factDivider: { borderLeftWidth: 1, borderColor: colors.line, paddingLeft: 8 },
  label: { color: colors.muted, fontSize: 12 },
  value: { color: colors.ink, fontWeight: "800", fontSize: 14, marginTop: 2 },
  form: { gap: space.gap, paddingVertical: 2 },
  row: { flexDirection: "row", gap: space.compact },
  field: { flex: 1, minWidth: 0 },
  error: { color: colors.danger },
});
