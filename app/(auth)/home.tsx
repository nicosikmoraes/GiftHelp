import PersonalInformations from "@/components/home/PersonalInformations";
import Wishlist from "@/components/home/Wishlist";
import BlankTemplate from "@/components/template/Blank";
import TitleComponent from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [shirtSize, setShirtSize] = useState("");
  const [PantsSize, setPantsSize] = useState("");
  const [ShoeSize, setShoeSize] = useState("");
  const [RingSize, setRingSize] = useState("");
  const [preferredColor, setPreferredColor] = useState("");

  function handlePersonalInformations() {}

  return (
    <BlankTemplate>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar_container}>
          <TitleComponent message="PROFILE" fontSize={20} />

          <View style={styles.avatar}></View>
        </View>

        <PersonalInformations />

        <Wishlist />
      </ScrollView>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#F6BBC1",
    height: 300,
    width: 100,
    marginTop: 50,
    marginBottom: 50,
    borderRadius: 100,
  },

  avatar_container: {
    display: "flex",
    alignItems: "center",
  },

  person_informations_container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
