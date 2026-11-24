import PasswordInput from "@/components/auth/PasswordInput";
import PostcardTemplate from "@/components/auth/PostcardTemplate";
import Input from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/vitrine";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function Login() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setErrors({});
    }, []),
  );

  function validateInputs() {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Informe seu e-mail.";
    else if (!/\S+@\S+\.\S+/.test(email.trim())) newErrors.email = "Confira o e-mail.";

    if (!password.trim()) newErrors.password = "Informe sua senha.";
    else if (password.length < 6)
      newErrors.password = "Use pelo menos 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (loading || !validateInputs()) return;

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/(auth)/home");
    } catch {
      setErrors({
        password: "Não foi possível entrar. Confira seus dados e a conexão.",
      });
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PostcardTemplate screen="login" title="Bom te ver de novo.">
      <Input
        label="E-mail"
        placeholder="voce@exemplo.com"
        value={email}
        onChangeText={(text) => { setEmail(text); setErrors((last) => ({ ...last, email: undefined })); }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />
      <PasswordInput
        label="Senha"
        placeholder="Sua senha"
        value={password}
        onChangeText={(text) => { setPassword(text); setErrors((last) => ({ ...last, password: undefined })); }}
        autoComplete="current-password"
        onSubmitEditing={handleLogin}
        error={errors.password}
      />
      <Pressable accessibilityRole="link" onPress={() => router.push("/forgot-password")} style={styles.forgot}>
        <Text style={styles.forgotLabel}>Esqueci a senha</Text>
      </Pressable>
      <PressableComponent message="Entrar" loading={loading} onPress={handleLogin} />
    </PostcardTemplate>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: "flex-end", minHeight: 44, justifyContent: "center", paddingHorizontal: 2, marginVertical: -4 },
  forgotLabel: { color: colors.action, fontSize: 13, fontWeight: "800" },
});
