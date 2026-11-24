import PasswordInput from "@/components/auth/PasswordInput";
import PostcardTemplate from "@/components/auth/PostcardTemplate";
import ErrorComponent from "@/components/ui/Error";
import Input from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import { isAxiosError } from "axios";
import { useState } from "react";

type FormErrors = Partial<Record<"name" | "email" | "password" | "form", string>>;
type ValidationResponse = { errors?: Partial<Record<"name" | "email" | "password", string[]>> };

function registrationErrors(error: unknown): FormErrors {
  if (!isAxiosError<ValidationResponse>(error)) {
    return { form: "Não foi possível criar a conta. Tente novamente." };
  }
  if (!error.response) {
    return { form: "O servidor não respondeu. Tente novamente em instantes." };
  }
  if (error.response.status === 422) {
    const fields = error.response.data?.errors;
    const errors: FormErrors = {};
    if (fields?.name?.length) errors.name = "Esse nome não está disponível. Experimente outro.";
    if (fields?.email?.length) errors.email = "Confira o e-mail. Se já tiver uma conta, entre com ele.";
    if (fields?.password?.length) errors.password = "Confira a senha. Use pelo menos 6 caracteres.";
    if (Object.keys(errors).length) return errors;
  }
  if (error.response.status === 429) {
    return { form: "Muitas tentativas. Aguarde um pouco antes de tentar novamente." };
  }
  return { form: "O servidor não conseguiu concluir o cadastro. Tente novamente." };
}

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { registerAccount } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: "name" | "email" | "password") {
    setErrors((last) => ({ ...last, [field]: undefined, form: undefined }));
  }

  async function handleRegister() {
    if (loading || !validateInputs()) return;
    setLoading(true);

    try {
      const result = await registerAccount({
        name: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });
      router.replace(result === "signed-in" ? "/(auth)/home" : "/login");
      showToast(result === "signed-in" ? "Conta criada" : "Conta criada. Entre com seu e-mail e senha.", "success");
    } catch (error) {
      setErrors(registrationErrors(error));
    } finally {
      setLoading(false);
    }
  }

  function validateInputs() {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Informe seu nome.";
    }

    if (!email.trim()) {
      newErrors.email = "Informe seu e-mail.";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = "Confira o e-mail.";
    }

    if (!password.trim()) {
      newErrors.password = "Informe uma senha.";
    } else if (password.length < 6) {
      newErrors.password = "Use pelo menos 6 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <PostcardTemplate screen="register" title="Crie sua conta.">
      <Input
        label="Nome"
        placeholder="Seu nome"
        value={name}
        onChangeText={(text) => { setName(text); clearError("name"); }}
        autoComplete="name"
        error={errors.name}
      />
      <Input
        label="E-mail"
        placeholder="voce@exemplo.com"
        value={email}
        onChangeText={(text) => { setEmail(text); clearError("email"); }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />
      <PasswordInput
        label="Senha"
        placeholder="Pelo menos 6 caracteres"
        value={password}
        onChangeText={(text) => { setPassword(text); clearError("password"); }}
        autoComplete="new-password"
        onSubmitEditing={handleRegister}
        error={errors.password}
      />
      {errors.form && <ErrorComponent message={errors.form} />}
      <PressableComponent message="Criar conta" onPress={handleRegister} loading={loading} />
    </PostcardTemplate>
  );
}
