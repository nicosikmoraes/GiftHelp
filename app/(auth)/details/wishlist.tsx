import BlankTemplate from "@/components/template/Blank";
import InputComponent from "@/components/ui/Input";
import InputNumberComponent from "@/components/ui/InputNumerico";
import SelectModal from "@/components/ui/ModalSelect";
import PressableComponent from "@/components/ui/Pressable";
import TitleComponent from "@/components/ui/Title";
import { getGiftTypes } from "@/services/gift";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function WishlistDetails() {
  const [types, setTypes] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    async function loadTypes() {
      const data = await getGiftTypes();
      setTypes(data);
    }

    loadTypes();
  }, []);

  function hanldeWishlist() {}

  return (
    <BlankTemplate>
      <>
        <View style={styles.container}>
          <TitleComponent message="Add a new suggestion" fontSize={20} />

          <InputComponent
            label="Title"
            placeholder="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />

          <SelectModal
            value={type}
            onChange={setType}
            options={types}
            label="Type"
            placeholder="Select type"
          />

          <View style={styles.price_quantity_container}>
            <InputNumberComponent
              label="Estimate price"
              placeholder="$"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
              }}
              amount={20}
              currency={true}
              width="49%"
            />
            <InputNumberComponent
              label="Quantity"
              placeholder="Value"
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
              }}
              amount={3}
              width="49%"
            />
          </View>

          <SelectModal
            value={color}
            onChange={setColor}
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
            label="Color"
            placeholder="Select"
          />

          <InputComponent
            label="Description"
            placeholder="Write a description"
          />

          <PressableComponent
            message="Create suggestion"
            onPress={hanldeWishlist}
          />
        </View>
      </>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
  price_quantity_container: {
    display: "flex",
    flexDirection: "row",
    gap: "2%",
  },
});
