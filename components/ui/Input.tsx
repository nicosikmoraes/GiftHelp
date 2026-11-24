import { colors, layout, radius } from "@/theme/vitrine";
import { useState, type ReactNode } from "react";
import { StyleSheet, Text, TextInput, View, type DimensionValue, type TextInputProps } from "react-native";
import ErrorComponent from "./Error";

export type InputProps = TextInputProps & {
  borderColor?: string;
  borderError?: string;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  error?: string;
  label?: string;
  marginBottom?: number;
  backgroundColor?: string;
  endAccessory?: ReactNode;
};

export default function InputComponent({
  borderColor = colors.action, width = "100%", height = layout.controlHeight, borderRadius = radius.control,
  borderError, error, marginBottom = 0, label, backgroundColor = colors.field,
  onFocus, onBlur, style, endAccessory, ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const stroke = error ? colors.danger : focused ? borderColor : !borderError || borderError === "transparent" ? colors.line : borderError;
  return (
    <View style={{ width, marginBottom }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View>
        <TextInput placeholderTextColor={colors.muted} selectionColor={borderColor} underlineColorAndroid="transparent"
          accessibilityLabel={label || props.placeholder}
          {...props}
          style={[styles.input, { borderColor: stroke, borderRadius, minHeight: height, backgroundColor }, endAccessory ? styles.inputWithAccessory : null, style]}
          onFocus={(event) => { setFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        />
        {endAccessory && <View style={styles.accessory}>{endAccessory}</View>}
      </View>
      {error ? <ErrorComponent message={error} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  input: { width: "100%", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, color: colors.ink, fontSize: 16 },
  inputWithAccessory: { paddingRight: 48 },
  accessory: { position: "absolute", top: 0, right: 0, bottom: 0, justifyContent: "center" },
});
