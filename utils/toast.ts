import { showMessage } from "react-native-flash-message";
import { colors } from "@/theme/vitrine";

const baseStyle = {
  animated: true,
  icon: "auto" as const,
  statusBarHeight: 35,
  titleStyle: {
    fontSize: 18,
  },
  backgroundColor: colors.shell,
  color: colors.onShell,
  style: {
    borderLeftWidth: 5,
  },
};

function getBorderColor(type: "success" | "danger" | "warning" | "info") {
  switch (type) {
    case "success":
      return colors.success;
    case "danger":
      return colors.onDanger;
    case "warning":
      return "#f59e0b";
    case "info":
      return colors.accent;
    default:
      return colors.accent;
  }
}

export function showToast(
  message: string,
  type: "success" | "danger" | "warning" | "info" = "info",
  description: string = "",
) {
  showMessage({
    message,
    description,
    type,
    ...baseStyle,
    style: {
      ...baseStyle.style,
      borderLeftColor: getBorderColor(type),
    },
  });
}
