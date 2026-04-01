import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function BlankTemplate({ children }: Props) {
  return (
    <View style={styles.container}>
      <Header />
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F0F0F",
  },
});
