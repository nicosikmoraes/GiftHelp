import { colors, radius, serif } from "@/theme/vitrine";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

const frames = 17;
const sprites = {
  terracota: require("../../assets/avatar/terracota.png"),
  sálvia: require("../../assets/avatar/salvia.png"),
  ameixa: require("../../assets/avatar/ameixa.png"),
};
const clamp = (frame: number) => Math.max(0, Math.min(frames - 1, frame));

function outfitFor(color?: string) {
  const normalized = color?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ?? "";
  if (/verde|salvia|green|sage/.test(normalized)) return "sálvia";
  if (/ameixa|roxo|violeta|lilas|purple|plum/.test(normalized)) return "ameixa";
  return "terracota";
}

export default function ProfileAvatar({ name, favoriteColor }: { name: string; favoriteColor?: string }) {
  const [width, setWidth] = useState(0);
  const [frame, setFrame] = useState(8);
  const current = useRef(8);
  const dragStart = useRef(8);
  const animation = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const outfit = outfitFor(favoriteColor);

  function stopTurn() {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null;
  }

  function showFrame(value: number) {
    const next = clamp(value);
    if (next === current.current) return;
    current.current = next;
    setFrame(next);
  }

  function turn(step: number) {
    stopTurn();
    const from = current.current;
    const to = clamp(from + step * 2);
    if (reduceMotion) return showFrame(to);
    let start: number | undefined;
    function tick(now: number) {
      start ??= now;
      const progress = Math.min(1, (now - start) / 125);
      showFrame(Math.round(from + (to - from) * progress));
      animation.current = progress < 1 ? requestAnimationFrame(tick) : null;
    }
    animation.current = requestAnimationFrame(tick);
  }

  useEffect(() => stopTurn, []);
  const drag = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy),
    onPanResponderGrant: () => {
      stopTurn();
      dragStart.current = current.current;
    },
    onPanResponderMove: (_, { dx }) => showFrame(dragStart.current + Math.round(dx / 10)),
  }), []);

  return (
    <LinearGradient colors={["#82503f", "#bd805e", "#ad7057"]} start={{ x: 0, y: 0 }} end={{ x: 0.98, y: 0.8 }} style={styles.hero}>
      <View pointerEvents="none" style={styles.arch} />
      <View pointerEvents="none" style={styles.platform} />
      <View pointerEvents="none" style={styles.title}>
        <Text accessibilityRole="header" numberOfLines={3} style={styles.name}>{name}</Text>
        <Text style={styles.caption}>Meu avatar</Text>
      </View>
      <View {...drag.panHandlers} onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)} style={styles.character}
        accessible accessibilityRole="image" accessibilityLabel={"Avatar de " + name + ", com jaqueta " + outfit}>
        {width > 0 && <Image source={sprites[outfit]} resizeMode="stretch" fadeDuration={0}
          accessible={false} style={{ width: width * frames, height: width * 228 / 180, left: -frame * width, position: "absolute" }} />}
      </View>
      <View style={styles.rotation}>
        {([-1, 1] as const).map((step) => {
          const disabled = step < 0 ? frame === 0 : frame === frames - 1;
          return (
            <Pressable key={step} accessibilityRole="button" accessibilityLabel={step < 0 ? "Girar avatar para a esquerda" : "Girar avatar para a direita"}
              accessibilityState={{ disabled }} disabled={disabled} onPress={() => turn(step)}
              style={({ pressed }) => [styles.turn, pressed && styles.pressed, disabled && styles.disabled]}>
              <Ionicons name={step < 0 ? "chevron-back" : "chevron-forward"} size={16} color={colors.onShell} />
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { height: 256, borderRadius: radius.card, overflow: "hidden" },
  arch: { position: "absolute", right: "8%", top: 10, bottom: 15, width: "61%", borderColor: "#e7ac85", borderWidth: 1, borderTopLeftRadius: 110, borderTopRightRadius: 110, borderBottomLeftRadius: 9, borderBottomRightRadius: 9, backgroundColor: "#edaa7425" },
  platform: { position: "absolute", right: "9%", bottom: 17, width: "55%", height: 30, backgroundColor: "#af7657", borderColor: "#e4a987", borderWidth: 1, borderRadius: 100 },
  title: { position: "absolute", zIndex: 1, top: 22, left: 14, maxWidth: "46%", gap: 6 },
  name: { fontFamily: serif, color: colors.onShell, fontSize: 34, lineHeight: 36, letterSpacing: -0.8 },
  caption: { fontSize: 12, fontWeight: "700", color: colors.onShell },
  character: { position: "absolute", right: "6%", bottom: 8, width: 196, maxWidth: "72%", aspectRatio: 180 / 228, overflow: "hidden" },
  rotation: { position: "absolute", zIndex: 2, left: 10, bottom: 12, flexDirection: "row", borderRadius: 24, borderColor: "#fff1df70", borderWidth: 1, backgroundColor: "#301e1ada" },
  turn: { width: 44, height: 44, justifyContent: "center", alignItems: "center", borderRadius: 22 },
  pressed: { backgroundColor: colors.shellLine },
  disabled: { opacity: 0.42 },
});
