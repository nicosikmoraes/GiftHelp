import { AxiosError } from "axios";
import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { getToken, removeToken, saveToken } from "../storage/auth";
import type { User } from "@/types/user";

export const AuthContext = createContext({} as any);

type ErrorResponse = {
  message: string;
};

type Session = { user: User; token: string };
type Registration = { name: string; email: string; password: string };

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function startSession({ user, token }: Session) {
    if (!user?.id || typeof token !== "string" || !token) {
      throw new Error("Sessão inválida");
    }
    await saveToken(token);
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
    setUser(user);
  }

  async function registerAccount(form: Registration): Promise<"signed-in" | "created"> {
    // A conta já existe após esta resposta. Uma falha ao abrir a sessão deve
    // encaminhar para o login em vez de incentivar o reenvio do cadastro.
    const { data } = await api.post<Session>("/register", form, {
      headers: { Accept: "application/json" },
      timeout: 12000,
    });
    try {
      await startSession(data);
      return "signed-in";
    } catch {
      return "created";
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post("/login", { email, password });

      await startSession(response.data);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      const message = err?.response?.data?.message || "Erro ao fazer login";
      throw new Error(message);
    }
  }

  async function signOut() {
    await removeToken();

    delete api.defaults.headers.common["Authorization"];

    setUser(null);

    router.replace("/(app)/login");
  }

  async function loadUser() {
    try {
      const token = await getToken();

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/user");

        setUser(response.data);
      }
    } catch (error) {
      await removeToken();

      setUser(null);
    }

    setLoading(false);
  }

  async function signInWithGoogle(googleToken: string) {
    try {
      const response = await api.post("/auth/google", {
        token: googleToken,
      });

      await startSession(response.data);
      return response.data.user;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao fazer login com Google";

      throw new Error(message);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ setUser, user, registerAccount, signIn, loading, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}
