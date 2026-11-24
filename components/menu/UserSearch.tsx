import { useAuth } from "@/hooks/useAuth";
import { searchUsers, type SearchUser } from "@/services/user";
import { colors, layout, radius, serif, space } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type SearchState =
  | { stage: "idle" | "loading" | "error" }
  | { stage: "results"; users: SearchUser[] };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
}

export default function UserSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>({ stage: "idle" });
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function search() {
    const name = query.trim();
    if (!name || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setState({ stage: "loading" });
    Keyboard.dismiss();

    try {
      const results = await searchUsers(name, controller.signal);
      if (!controller.signal.aborted) {
        setState({ stage: "results", users: results.filter((result) => result.id !== user?.id) });
      }
    } catch {
      if (!controller.signal.aborted) setState({ stage: "error" });
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  function changeQuery(text: string) {
    request.current?.abort();
    request.current = null;
    setQuery(text);
    setState({ stage: "idle" });
  }

  const loading = state.stage === "loading";
  const disabled = loading || !query.trim();
  const results = state.stage === "results" && state.users.length > 0 ? state.users : null;
  const message = state.stage === "error"
    ? ["A busca não carregou", "Toque em Buscar para tentar de novo."] as const
    : state.stage === "results"
      ? ["Ninguém encontrado", "Confira o nome ou tente buscar por outra parte dele."] as const
      : ["Encontre pessoas", "Digite um nome para buscar no Laço."] as const;

  return (
    <View style={styles.content}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Ionicons name="search-outline" size={17} color={colors.muted} />
          <TextInput accessibilityLabel="Nome da pessoa" value={query} onChangeText={changeQuery} onSubmitEditing={search}
            returnKeyType="search" placeholder="Buscar por nome" placeholderTextColor={colors.muted} style={styles.input} />
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled, busy: loading }} disabled={disabled} onPress={search}
          style={({ pressed }) => [styles.search, disabled && styles.disabled, pressed && styles.pressed]}>
          <Text style={styles.searchText}>Buscar</Text>
        </Pressable>
      </View>
      {loading ? (
        <View accessible accessibilityLabel="Buscando pessoas" accessibilityLiveRegion="polite" style={styles.placeholder}>
          <ActivityIndicator color={colors.action} /><Text style={styles.description}>Buscando pessoas…</Text>
        </View>
      ) : results ? (
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.results} contentContainerStyle={styles.resultContent}>
          <Text accessibilityRole="header" style={styles.resultTitle}>Resultados</Text>
          {results.map((person) => (
            <View key={person.id} style={styles.person}>
              <View style={styles.initials}><Text style={styles.initialText}>{initials(person.name)}</Text></View>
              <Text style={styles.personName}>{person.name}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View accessibilityLiveRegion="polite" style={styles.placeholder}>
          <View style={styles.emptyMark}><Ionicons name={state.stage === "error" ? "alert-circle-outline" : "people-outline"} color={colors.action} size={23} /></View>
          <Text style={styles.emptyTitle}>{message[0]}</Text>
          <Text style={styles.description}>{message[1]}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: space.gap, flexShrink: 1 },
  form: { flexDirection: "row", gap: 7, alignItems: "center" },
  field: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", backgroundColor: colors.field, borderColor: colors.line, borderWidth: 1, borderRadius: radius.control, paddingHorizontal: 9, gap: 6 },
  input: { flex: 1, minWidth: 0, minHeight: layout.controlHeight, color: colors.ink, fontSize: 16 },
  search: { minHeight: layout.controlHeight, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: radius.control, backgroundColor: colors.action },
  searchText: { color: colors.onShell, fontSize: 14, fontWeight: "800" },
  disabled: { opacity: 0.57 },
  pressed: { opacity: 0.75 },
  placeholder: { alignItems: "center", backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 7 },
  emptyMark: { width: 44, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: colors.tint, borderRadius: 22 },
  emptyTitle: { color: colors.ink, fontFamily: serif, fontSize: 20, textAlign: "center" },
  description: { color: colors.muted, textAlign: "center", fontSize: 13 },
  results: { maxHeight: 300 },
  resultContent: { gap: 7, paddingBottom: 3 },
  resultTitle: { color: colors.muted, fontWeight: "700", fontSize: 13 },
  person: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 53, padding: 6, borderWidth: 1, borderColor: colors.line, borderRadius: radius.control, backgroundColor: colors.field },
  initials: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: colors.tint },
  initialText: { color: colors.action, fontWeight: "700", fontSize: 12 },
  personName: { flexShrink: 1, color: colors.ink, fontWeight: "700", fontSize: 15 },
});
