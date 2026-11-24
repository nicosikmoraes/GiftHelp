import { AuthProvider } from "@/context/AuthContext";
import { colors, serif } from "@/theme/vitrine";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [serif]: require("../assets/fonts/Fraunces.ttf"),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.shell,
          },
        }}
      />
      <FlashMessage />
    </AuthProvider>
  );
}
