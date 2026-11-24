import Input, { type InputProps } from "@/components/ui/Input";
import { colors } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function PasswordInput(props: Omit<InputProps, "secureTextEntry" | "endAccessory">) {
  const [visible, setVisible] = useState(false);
  return (
    <Input {...props} autoCapitalize="none" autoCorrect={false} secureTextEntry={!visible} endAccessory={
      <Pressable accessibilityRole="button" accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
        onPress={() => setVisible((value) => !value)} style={styles.button}>
        <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={18} color={colors.muted} />
      </Pressable>
    } />
  );
}

const styles = StyleSheet.create({
  button: { width: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
});
