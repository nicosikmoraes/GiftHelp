type ToastType = "success" | "error" | "warning";

let showFn: (message: string, type: ToastType) => void;

export function setToastRef(fn: typeof showFn) {
  showFn = fn;
}

export function showToast(message: string, type: ToastType = "success") {
  if (showFn) {
    showFn(message, type);
  }
}
