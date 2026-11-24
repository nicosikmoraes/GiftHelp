import { colors, radius } from "@/theme/vitrine";
import { getGiftStyle } from "@/utils/giftStyle";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export default function GiftArt({ type }: { type: string }) {
  const normalized = type?.toLowerCase() ?? "";
  const book = /book|livro/.test(normalized);
  const disc = /music|músic/.test(normalized);
  const bag = /accessor|acessór|acessor/.test(normalized);
  const palette = book ? ["#e6b695", "#b87557"] as const
    : disc ? ["#ded0e8", "#a78bb5"] as const
      : bag ? ["#d3dec1", "#94aa7d"] as const
        : ["#f3dcc7", "#e5bc9f"] as const;

  return (
    <LinearGradient colors={palette} start={{ x: 0.15, y: 0 }} end={{ x: 1, y: 1 }} style={styles.art}>
      {book ? <View style={styles.book}><View style={styles.bookCover}><View style={styles.bookSun} /></View></View>
        : disc ? <View style={styles.disc}><View style={styles.discGroove}><View style={styles.discLabel}><View style={styles.discHole} /></View></View></View>
          : bag ? <View style={styles.bag}><View style={styles.bagHandle} /><View style={styles.bagBody} /></View>
            : <Ionicons name={getGiftStyle(type).icon} size={25} color={colors.action} />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  art: { width: "100%", flex: 1, minHeight: 49, borderRadius: radius.art, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  book: { width: 24, height: 34, transform: [{ rotate: "-14deg" }], backgroundColor: "#9b5036", borderBottomWidth: 3, borderBottomColor: "#f7d6ae", borderLeftWidth: 2, borderLeftColor: "#6e392b", borderRadius: 3, justifyContent: "flex-start", alignItems: "center", paddingTop: 7 },
  bookCover: { width: 14, height: 11, borderWidth: 1, borderColor: "#f4c599", backgroundColor: "#bf7857", padding: 2, alignItems: "flex-end" },
  bookSun: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#fbe0ab" },
  disc: { width: 37, height: 37, borderRadius: 19, backgroundColor: "#382a40", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#6d526d" },
  discGroove: { width: 27, height: 27, borderRadius: 14, borderWidth: 1, borderColor: "#726079", alignItems: "center", justifyContent: "center" },
  discLabel: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#ddb4c7", alignItems: "center", justifyContent: "center" },
  discHole: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#302139" },
  bag: { alignItems: "center", transform: [{ rotate: "8deg" }] },
  bagHandle: { width: 14, height: 11, borderWidth: 2, borderColor: "#4d643e", borderBottomWidth: 0, borderTopLeftRadius: 7, borderTopRightRadius: 7 },
  bagBody: { width: 28, height: 21, backgroundColor: "#56704b", borderRadius: 4, borderLeftWidth: 3, borderLeftColor: "#435b3c" },
});
