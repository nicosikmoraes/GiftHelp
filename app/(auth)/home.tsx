import CenteredTemplate from "@/components/template/Default";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function Home() {
  const { signOut } = useAuth();
  const { user } = useAuth();

  async function handleLogOut() {
    await signOut();
  }

  return (
    <CenteredTemplate>
      <TextComponent message={`Welcome ${user?.name}`} />

      <PressableComponent message="Exit" width={120} onPress={handleLogOut} />

      <PressableComponent
        message="Events"
        width={120}
        onPress={() => router.push("/(auth)/events")}
      />
    </CenteredTemplate>
  );
}

const styles = StyleSheet.create({});
