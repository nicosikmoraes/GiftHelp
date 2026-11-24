import { colors, layout, radius, serif, space } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Sheet({ visible, title, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const offset = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (!visible || reduceMotion) {
      offset.setValue(0);
      return;
    }
    offset.setValue(24);
    const motion = Animated.timing(offset, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    });
    motion.start();
    return () => motion.stop();
  }, [offset, reduceMotion, visible]);

  return (
    <Modal transparent visible={visible} animationType={reduceMotion ? "none" : "fade"} onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.frame} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable accessible={false} style={styles.backdrop} onPress={onClose} />
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16), transform: [{ translateY: offset }] }]}
        >
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <Ionicons name="close" size={21} color={colors.action} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  sheet: {
    width: "100%",
    maxWidth: layout.contentWidth,
    maxHeight: "88%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderColor: colors.line,
    borderTopWidth: 1,
    paddingHorizontal: space.panel,
    paddingTop: space.gap,
    gap: space.gap,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.gap },
  title: { color: colors.ink, fontFamily: serif, fontSize: 28, flexShrink: 1 },
  close: {
    width: layout.controlHeight,
    height: layout.controlHeight,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tint,
  },
  pressed: { opacity: 0.67 },
});
