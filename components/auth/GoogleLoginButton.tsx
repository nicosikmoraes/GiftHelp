import { useAuth } from "@/hooks/useAuth";
import { radius } from "@/theme/vitrine";
import { showToast } from "@/utils/toast";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const googleG = require("../../assets/images/google-g.png");

export default function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const handledToken = useRef<string | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "62393066471-k7u83h6vk2sq1t7el0skc9j36pofom2c.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type !== "success") return;
    const token = response.authentication?.accessToken;
    if (!token || handledToken.current === token) return;

    handledToken.current = token;
    setBusy(true);
    signInWithGoogle(token)
      .then(() => router.replace("/(auth)/home"))
      .catch(() => showToast("Não foi possível continuar com Google.", "danger"))
      .finally(() => setBusy(false));
  }, [response, signInWithGoogle]);

  async function openGoogle() {
    try {
      const result = await promptAsync();
      if (result.type === "error") showToast("Não foi possível continuar com Google.", "danger");
    } catch {
      showToast("Não foi possível abrir o login do Google.", "danger");
    }
  }

  const disabled = !request || busy;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Continuar com Google"
      accessibilityState={{ disabled, busy }} disabled={disabled} onPress={openGoogle}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Image source={googleG} resizeMode="contain" style={styles.icon} accessible={false} />
      <Text style={styles.text}>Continuar com Google</Text>
      {busy && <ActivityIndicator size="small" color="#1F1F1F" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44, flexDirection: "row", justifyContent: "center", alignItems: "center",
    paddingVertical: 6, paddingHorizontal: 12, gap: 10, backgroundColor: "#FFFFFF",
    borderRadius: radius.control, borderWidth: 1, borderColor: "#747775",
  },
  pressed: { backgroundColor: "#F2F2F2" },
  icon: { width: 18, height: 18 },
  text: { fontSize: 14, color: "#1F1F1F", fontWeight: "600", flexShrink: 1, textAlign: "center" },
});
