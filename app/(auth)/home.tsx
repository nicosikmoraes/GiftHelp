import BlankTemplate from "@/components/template/Blank";
import InputComponent from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TitleComponent from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [shirtSize, setShirtSize] = useState("");
  const [PantsSize, setPantsSize] = useState("");

  return (
    <BlankTemplate>
      <View style={styles.avatar_container}>
        <TitleComponent message="PROFILE" fontSize={20} />

        <View style={styles.avatar}></View>
      </View>

      <TitleComponent message="PERSON INFORMATIONS" fontSize={20} />

      <View style={styles.person_informations_container}>
        <Select
          value={shirtSize}
          onChange={setShirtSize}
          options={[
            { label: "PP", value: "PP" },
            { label: "P", value: "P" },
            { label: "M", value: "M" },
            { label: "G", value: "G" },
            { label: "GG", value: "GG" },
          ]}
          width={120}
          label="Shirt Size"
          placeholder="Size"
        />

        <InputComponent
          label="Pants Size"
          width={120}
          placeholder="Size"
          value={PantsSize}
          onChangeText={(text) => {
            setPantsSize(text);
          }}
        />
      </View>
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
    gap: "3%",
  },
});
