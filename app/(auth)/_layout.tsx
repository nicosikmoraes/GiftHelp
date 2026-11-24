import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { colors } from "@/theme/vitrine";

export default function AppLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.shell },
      }}
    />
  );
}
