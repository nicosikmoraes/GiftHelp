import SelectModal from "@/components/ui/ModalSelect";
import PressableComponent from "@/components/ui/Pressable";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/services/user";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import InputNumberComponent from "../ui/InputNumerico";
import TitleComponent from "../ui/Title";

export default function PersonalInformations() {
  const { user, setUser } = useAuth();
  const [shirtSize, setShirtSize] = useState("");
  const [PantsSize, setPantsSize] = useState("");
  const [ShoeSize, setShoeSize] = useState("");
  const [RingSize, setRingSize] = useState("");
  const [preferredColor, setPreferredColor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setShirtSize(user.shirt_size || "");
      setPantsSize(user.pants_size?.toString() || "");
      setShoeSize(user.shoe_size?.toString() || "");
      setRingSize(user.ring_size?.toString() || "");
      setPreferredColor(user.preferred_color || "");
    }
  }, [user]);

  async function handlePersonalInformations() {
    try {
      setLoading(true);
      const payload: any = {};

      if (shirtSize) payload.shirt_size = shirtSize;
      if (PantsSize) payload.pants_size = PantsSize;
      if (ShoeSize) payload.shoe_size = ShoeSize;
      if (RingSize) payload.ring_size = RingSize;
      if (preferredColor) payload.preferred_color = preferredColor;

      const updatedUser = await updateUser(payload);

      setUser(updatedUser);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao atualizar usuário";

      console.log(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TitleComponent message="PERSONAL INFORMATIONS" fontSize={20} />

      <View style={styles.person_informations_container}>
        <SelectModal
          value={shirtSize}
          onChange={setShirtSize}
          options={[
            { label: "PP", value: "PP" },
            { label: "P", value: "P" },
            { label: "M", value: "M" },
            { label: "G", value: "G" },
            { label: "GG", value: "GG" },
          ]}
          width="33%"
          label="Shirt Size"
          placeholder="Select"
        />

        <InputNumberComponent
          label="Pants Size"
          width="33%"
          placeholder="Size"
          value={PantsSize}
          onChangeText={(text) => {
            setPantsSize(text);
          }}
        />

        <InputNumberComponent
          label="Shoe Size"
          width="33%"
          placeholder="Size"
          value={ShoeSize}
          onChangeText={(text) => {
            setShoeSize(text);
          }}
        />
      </View>
      <View
        style={[styles.person_informations_container, { marginBottom: 20 }]}
      >
        <InputNumberComponent
          label="Ring Size"
          width="33%"
          placeholder="Nº"
          value={RingSize}
          onChangeText={(text) => {
            setRingSize(text);
          }}
        />
        <SelectModal
          value={preferredColor}
          onChange={setPreferredColor}
          options={[
            { label: "White", value: "white" },
            { label: "Black", value: "black" },
            { label: "Gray", value: "gray" },
            { label: "Silver", value: "silver" },

            { label: "Red", value: "red" },
            { label: "Dark Red", value: "dark_red" },
            { label: "Pink", value: "pink" },

            { label: "Blue", value: "blue" },
            { label: "Light Blue", value: "light_blue" },
            { label: "Navy", value: "navy" },

            { label: "Green", value: "green" },
            { label: "Dark Green", value: "dark_green" },
            { label: "Lime", value: "lime" },

            { label: "Yellow", value: "yellow" },
            { label: "Gold", value: "gold" },

            { label: "Orange", value: "orange" },

            { label: "Purple", value: "purple" },
            { label: "Violet", value: "violet" },

            { label: "Brown", value: "brown" },
            { label: "Beige", value: "beige" },
          ]}
          width="66%"
          label="Prefered Color"
          placeholder="Select"
        />
      </View>

      <PressableComponent
        message="Save"
        onPress={handlePersonalInformations}
        loading={loading}
      />
    </>
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
