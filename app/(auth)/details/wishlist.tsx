import BlankTemplate from "@/components/template/Blank";
import Input from "@/components/ui/Input";
import NumberInput from "@/components/ui/InputNumerico";
import SelectModal from "@/components/ui/ModalSelect";
import Button from "@/components/ui/Pressable";
import TextArea from "@/components/ui/TextArea";
import Title from "@/components/ui/Title";
import { getColors } from "@/services/color";
import { createGift, getGiftTypes, type CreateGiftPayload } from "@/services/gift";
import { colors, radius, space } from "@/theme/vitrine";
import type { SelectionOption } from "@/types/selection";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WishlistDetails() {
  const [types, setTypes] = useState<SelectionOption[]>([]);
  const [colorOptions, setColorOptions] = useState<SelectionOption[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [catalog, setCatalog] = useState({ typesFailed: false, colorsFailed: false });
  const [form, setForm] = useState({ name: "", type: "", color: "", price: "", quantity: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string; type?: string; quantity?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCatalog({ typesFailed: false, colorsFailed: false });
    getGiftTypes(controller.signal).then((data) => {
      if (!controller.signal.aborted) setTypes(data);
    }).catch(() => {
      if (!controller.signal.aborted) setCatalog((state) => ({ ...state, typesFailed: true }));
    });
    getColors(controller.signal).then((data) => {
      if (!controller.signal.aborted) setColorOptions(data);
    }).catch(() => {
      if (!controller.signal.aborted) setCatalog((state) => ({ ...state, colorsFailed: true }));
    });
    return () => controller.abort();
  }, [attempt]);

  function change(field: keyof typeof form, value: string) {
    setForm((last) => ({ ...last, [field]: value }));
    setErrors((last) => ({ ...last, [field]: undefined }));
  }

  async function submit() {
    if (loading) return;
    const name = form.name.trim();
    const quantity = form.quantity ? Number(form.quantity) : undefined;
    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Informe o nome do presente.";
    if (!form.type) nextErrors.type = "Selecione o tipo de presente.";
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1)) nextErrors.quantity = "Informe uma quantidade maior que zero.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload: CreateGiftPayload = {
      name,
      type: form.type,
      color: form.color || undefined,
      price: form.price ? Number(form.price.replace(/\D/g, "")) / 100 : undefined,
      quantity,
      description: form.description.trim() || undefined,
    };
    try {
      setLoading(true);
      await createGift(payload);
      router.replace("/(auth)/home");
      showToast("Presente adicionado à lista", "success");
    } catch {
      showToast("Não foi possível adicionar o presente", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlankTemplate back>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Title message="Novo presente" fontSize={30} />
          <Input label="Nome" placeholder="Ex.: Caderno de capa dura" value={form.name} onChangeText={(value) => change("name", value)} error={errors.name} />
          <View style={styles.row}>
            <View style={styles.field}><SelectModal value={form.type} options={types} label="Tipo" error={errors.type} onChange={(value) => change("type", value)} /></View>
            <View style={styles.field}><SelectModal value={form.color} options={colorOptions} label="Cor" onChange={(value) => change("color", value)} /></View>
          </View>
          {(catalog.typesFailed || catalog.colorsFailed) && <Pressable accessibilityRole="button" onPress={() => setAttempt((last) => last + 1)} style={styles.retry}>
            <Text style={styles.retryLabel}>Tentar carregar as opções</Text>
          </Pressable>}
          <View style={styles.row}>
            <View style={styles.field}><NumberInput label="Preço estimado" value={form.price} amount={12} currency placeholder="R$ 0,00" onChangeText={(value) => change("price", value)} /></View>
            <View style={styles.field}><NumberInput label="Quantidade" value={form.quantity} amount={3} placeholder="1" error={errors.quantity} onChangeText={(value) => change("quantity", value)} /></View>
          </View>
          <TextArea label="Descrição" value={form.description} placeholder="Detalhes para ajudar na escolha" onChangeText={(value) => change("description", value)} />
          <Button message="Adicionar à lista" loading={loading} onPress={submit} />
        </View>
      </ScrollView>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.page },
  form: { padding: space.panel, gap: space.gap, borderRadius: radius.card, backgroundColor: colors.paper },
  row: { flexDirection: "row", gap: space.compact },
  field: { flex: 1, minWidth: 0 },
  retry: { minHeight: 44, justifyContent: "center" },
  retryLabel: { color: colors.action, fontWeight: "700" },
});
