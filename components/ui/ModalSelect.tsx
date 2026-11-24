import { colors, radius } from "@/theme/vitrine";
import type { SelectionOption } from "@/types/selection";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";
import ErrorComponent from "./Error";
import Input from "./Input";

type Props = {
  options: SelectionOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  width?: DimensionValue;
  label?: string;
};

export default function SelectModal({
  options, value, onChange, placeholder = "Selecione", error, width = "100%", label,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) => option.label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));

  function toggle() {
    setOpen((last) => !last);
    setSearch("");
  }

  return (
    <View style={{ width }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable accessibilityRole="button" accessibilityLabel={label ? label + ": " + (selected?.label || placeholder) : selected?.label || placeholder}
        accessibilityState={{ expanded: open }} onPress={toggle} style={[styles.control, (open || error) && { borderColor: error ? colors.danger : colors.action }]}>
        <Text style={[styles.value, !selected && styles.muted]}>{selected?.label || placeholder}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} color={colors.action} size={16} />
      </Pressable>
      {error ? <ErrorComponent message={error} /> : null}
      {open && <View style={styles.options}>
        {options.length > 8 && <Input value={search} onChangeText={setSearch} placeholder="Filtrar opções" />}
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.list}>
          {filtered.map((option) => (
            <Pressable key={option.value} accessibilityRole="button" accessibilityState={{ selected: value === option.value }}
              onPress={() => { onChange(option.value); toggle(); }}
              style={({ pressed }) => [styles.option, (value === option.value || pressed) && styles.selected]}>
              <Text style={styles.value}>{option.label}</Text>
            </Pressable>
          ))}
          {filtered.length === 0 && <Text style={styles.empty}>Nenhuma opção</Text>}
        </ScrollView>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  control: { minHeight: 44, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.line, borderRadius: radius.control, backgroundColor: colors.field, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4 },
  value: { color: colors.ink, fontSize: 15, flexShrink: 1 },
  muted: { color: colors.muted },
  options: { backgroundColor: colors.field, borderWidth: 1, borderColor: colors.line, borderRadius: radius.control, marginTop: 4, padding: 5, gap: 4 },
  option: { minHeight: 44, borderRadius: 8, justifyContent: "center", paddingHorizontal: 7 },
  selected: { backgroundColor: colors.tint },
  empty: { color: colors.muted, padding: 6 },
  list: { maxHeight: 190 },
});
