import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Toast from "../ui/Toast/Toast";
import FooterDefault from "./FooterDefault";
import Header from "./Header";
type Props = {
  children: React.ReactNode;
};

export default function BlankTemplate({ children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <Toast />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20} // 🔥 importante
      >
        <View style={{ flex: 1 }}>{children}</View>
      </KeyboardAvoidingView>

      <FooterDefault />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  header: {
    padding: 20,
  },
});
