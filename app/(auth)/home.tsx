import PersonalInformations from "@/components/home/PersonalInformations";
import ProfileAvatar from "@/components/home/ProfileAvatar";
import Wishlist from "@/components/home/Wishlist";
import SideMenu from "@/components/menu/SideMenu";
import BlankTemplate from "@/components/template/Blank";
import { useAuth } from "@/hooks/useAuth";
import { getColors, type ColorOption } from "@/services/color";
import { space } from "@/theme/vitrine";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [friends, setFriends] = useState(false);
  const [options, setOptions] = useState<ColorOption[]>([]);
  const [catalog, setCatalog] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCatalog("loading");
    getColors(controller.signal).then((next) => {
      if (controller.signal.aborted) return;
      setOptions(next);
      setCatalog("ready");
    }).catch(() => {
      if (!controller.signal.aborted) setCatalog("error");
    });
    return () => controller.abort();
  }, [attempt]);

  const preferred = String(user?.preferred_color ?? "");
  const favoriteColor = options.find((item) => item.value === preferred)?.label
    ?? (preferred && Number.isNaN(Number(preferred)) ? preferred : undefined);

  return (
    <BlankTemplate action={{ icon: "people-outline", label: "Amigos", onPress: () => setFriends(true) }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProfileAvatar name={user?.name || "Meu perfil"} favoriteColor={favoriteColor} />
        <PersonalInformations colorOptions={options} catalog={catalog} favoriteColor={favoriteColor} retryColors={() => setAttempt((last) => last + 1)} />
        <Wishlist />
      </ScrollView>
      <SideMenu visible={friends} onClose={() => setFriends(false)} />
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.page, paddingTop: 3, paddingBottom: space.gap, gap: space.compact },
});
