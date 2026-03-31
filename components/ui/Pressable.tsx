import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Loading from "./Loading";
import TextComponent from "./Text";

type Props = {
  backgroundColor?: string;
  padding?: number;
  width?: any;
  height?: number;
  borderRadius?: number;
  marginTop?: number;
  message: string;
  loading?: boolean;
  onPress: () => void;
};

export default function PressableComponent({
  marginTop = 0,
  backgroundColor = "#E65C00",
  borderRadius = 12,
  width = "100%",
  height = 45,
  loading = false,
  message,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[
        styles.btn,
        { backgroundColor: backgroundColor },
        { borderRadius: borderRadius },
        { width: width },
        { height: height },
        { marginTop: marginTop },
      ]}
    >
      {loading ? (
        <Loading />
      ) : (
        <TextComponent
          message={message}
          fontWeight={900}
          fontSize={16}
          color="#1A1A1A"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    display: "flex",
    justifyContent: "center",
    padding: 10,
  },
});
