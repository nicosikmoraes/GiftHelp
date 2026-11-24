import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Header from "@/components/template/Header";
import Title from "@/components/ui/Title";
import { colors, radius } from "@/theme/vitrine";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const routes = [
  { id: "login", label: "Entrar", href: "/login" },
  { id: "register", label: "Criar conta", href: "/register" },
] as const;

const headerHeight = 55;
const verticalPadding = 10;
const postcardGap = 10;
const postcard = require("../../assets/images/auth-postcard.jpg");

type Props = {
  screen: (typeof routes)[number]["id"];
  title: string;
  children: ReactNode;
};

export default function PostcardTemplate({ screen, title, children }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const [viewport, setViewport] = useState(0);
  const [panelHeight, setPanelHeight] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const progress = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const ios = Platform.OS === "ios";
    const show = Keyboard.addListener(ios ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboard(true));
    const hide = Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboard(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const replay = useCallback(() => {
    if (reduceMotion) return;
    progress.stopAnimation();
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [progress, reduceMotion]);

  useEffect(() => {
    replay();
    return () => progress.stopAnimation();
  }, [replay]);

  const available = viewport || windowHeight;
  const formHeight = panelHeight || (screen === "register" ? 393 : 365);
  const remaining = available - headerHeight - formHeight - verticalPadding;
  const compact = available < 650;
  const minimum = compact ? 44 : 72;
  const sceneHeight = keyboard || remaining < minimum + postcardGap
    ? 0
    : Math.min(222, Math.max(minimum, remaining - postcardGap));
  const scrollEnabled = formHeight + headerHeight + verticalPadding + (sceneHeight ? sceneHeight + postcardGap : 0) > available + 1;
  const cardMotion = {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.76, 1] }),
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 0.64, 1], outputRange: [7, -2, 0] }) },
      { rotate: progress.interpolate({ inputRange: [0, 0.64, 1], outputRange: ["2deg", "-3.6deg", "-2.4deg"] }) },
    ],
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}>
        <ScrollView
          onLayout={({ nativeEvent }) => setViewport(nativeEvent.layout.height)}
          scrollEnabled={scrollEnabled}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={scrollEnabled}
          contentContainerStyle={styles.viewport}
        >
          <View style={styles.frame}>
            <Header action={sceneHeight && !reduceMotion ? { icon: "play-outline", label: "Rever animação", onPress: replay } : undefined} />
            {sceneHeight > 0 && (
              <View style={[styles.scene, { height: sceneHeight }]} pointerEvents="none">
                <Animated.View style={[styles.postcard, cardMotion]}>
                  <View style={styles.underlay} />
                  <View style={styles.print}>
                    <Image source={postcard} resizeMode="cover" style={styles.art}
                      accessible accessibilityLabel="Presente de papel creme com laço terracota, entre envelopes e cartões" />
                  </View>
                </Animated.View>
              </View>
            )}
            <View onLayout={({ nativeEvent }) => setPanelHeight(nativeEvent.layout.height)} style={[styles.panel, compact && styles.compactPanel]}>
              <View style={styles.tabs}>
                {routes.map(({ id, label, href }) => {
                  const selected = id === screen;
                  return (
                    <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected }}
                      onPress={() => { if (!selected) router.replace(href); }}
                      style={({ pressed }) => [styles.tab, selected && styles.selectedTab, pressed && !selected && styles.pressedTab]}>
                      <Text style={[styles.tabLabel, selected && styles.selectedLabel]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Title message={title} fontSize={compact ? 24 : 30} variant="sans" align="left" />
              <View style={[styles.form, compact && styles.compactForm]}>{children}</View>
              <GoogleLoginButton />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.shell },
  keyboard: { flex: 1 },
  viewport: { flexGrow: 1, alignItems: "center", paddingBottom: verticalPadding },
  frame: { width: "100%", maxWidth: 430 },
  scene: { marginHorizontal: 19, marginTop: 3, marginBottom: postcardGap - 3 },
  postcard: { position: "absolute", inset: 0, marginBottom: 5 },
  underlay: { ...StyleSheet.absoluteFillObject, top: 5, left: 4, right: -4, bottom: -5, backgroundColor: colors.accent, borderRadius: 8, opacity: 0.68 },
  print: { ...StyleSheet.absoluteFillObject, overflow: "hidden", borderColor: colors.surface, borderWidth: 4, borderRadius: 8, backgroundColor: colors.paper },
  art: { width: "100%", height: "100%" },
  panel: { marginHorizontal: 10, padding: 13, gap: 9, borderRadius: radius.card, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  compactPanel: { padding: 9, gap: 6 },
  tabs: { flexDirection: "row", gap: 2, padding: 2, borderRadius: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.tint },
  tab: { flex: 1, minHeight: 44, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  selectedTab: { backgroundColor: colors.field },
  pressedTab: { opacity: 0.64 },
  tabLabel: { color: colors.muted, fontWeight: "800", fontSize: 13, textAlign: "center" },
  selectedLabel: { color: colors.action },
  form: { gap: 7 },
  compactForm: { gap: 5 },
});
