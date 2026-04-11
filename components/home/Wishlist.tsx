import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import PressableComponent from "../ui/Pressable";
import TitleComponent from "../ui/Title";

export default function Wishlist() {
  return (
    <View style={styles.wishlist_container}>
      <>
        <TitleComponent message="Wishlist" fontSize={20} />
        // FlatList
        <PressableComponent
          message="Add new gift"
          onPress={() => router.push("/(auth)/details/wishlist")}
        />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  wishlist_container: {
    marginTop: 40,
  },
});
