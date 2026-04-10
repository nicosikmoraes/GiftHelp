import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { setToastRef } from "./ToastController";

export default function Toast() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "warning">("success");
  const [visible, setVisible] = useState(false);

  const translateY = useRef(new Animated.Value(-100)).current;

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
  };

  function show(message: string, type: "success" | "error" | "warning") {
    setMessage(message);
    setType(type);
    setVisible(true);
  }

  useEffect(() => {
    setToastRef(show);
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 2000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors[type],
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 150,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    zIndex: 999,
  },

  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
