import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import TextComponent from "./Text";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  width?: any;
  label?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  width = "100%",
  label = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <View style={{ width: width }}>
      <TextComponent message={label} textAlign="left" />
      <Pressable
        style={[
          styles.select,
          {
            borderColor: error ? "red" : focused ? "#E65C00" : "#1A1A1A",
            marginTop: 5,
          },
        ]}
        onPress={() => {
          setOpen(!open);
          setFocused(true);
        }}
      >
        <Text style={styles.text}>
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  setFocused(false);
                }}
              >
                <Text style={styles.text}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
    height: 45,
    display: "flex",
    justifyContent: "center",
  },

  text: {
    color: "#B3B3B3",
    fontSize: 16,
  },

  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
    maxHeight: 125,
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    display: "flex",
    justifyContent: "center",
  },

  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
