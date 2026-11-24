import CenteredTemplate from "@/components/template/Default";
import ErrorComponent from "@/components/ui/Error";
import InputComponent from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { api } from "@/services/api";
import { colors } from "@/theme/vitrine";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleForgotPassword() {
    if (!email) {
      setError("Informe um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/forgot-password", {
        email,
      });

      alert(response.data.message);
    } catch (error: any) {
      setError("Não foi possível enviar o e-mail.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CenteredTemplate>
      <View style={styles.title_container}>
        <TitleComponent message="Recuperar senha" fontSize={29} />

        <TextComponent
          message="Informe o e-mail da sua conta."
          color={colors.muted}
          fontSize={15}
        />
      </View>

      <View style={styles.input_container}>
        <View>
          <InputComponent
            label="E-mail"
            placeholder="voce@exemplo.com"
            value={email}
            borderError={error ? "red" : "transparent"}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
          />
          {error ? <ErrorComponent message={error} /> : null}
        </View>

        <PressableComponent
          marginTop={10}
          message="Enviar e-mail"
          loading={loading}
          onPress={handleForgotPassword}
        />
      </View>
    </CenteredTemplate>
  );
}

const styles = StyleSheet.create({
  title_container: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  input_container: {
    display: "flex",
    gap: 10,
    width: "100%",
  },
});
