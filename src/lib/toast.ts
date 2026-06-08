/**
 * Animated toast helpers — wrap sonner with motion-enhanced messages
 * Usage: showSuccessToast("تم التسجيل بنجاح!")
 *        showErrorToast("حدث خطأ!")
 */
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface AnimatedToastOptions {
  description?: string;
  duration?: number;
}

const ICONS: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

function makeMessage(icon: string, message: string) {
  return `${icon}  ${message}`;
}

export function showSuccessToast(message: string, opts?: AnimatedToastOptions) {
  toast.success(makeMessage(ICONS.success, message), {
    description: opts?.description,
    duration: opts?.duration ?? 3000,
    style: {
      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
      color: "#065f46",
      border: "1px solid #6ee7b7",
      fontWeight: "600",
      borderRadius: "16px",
      direction: "rtl",
    },
  });
}

export function showErrorToast(message: string, opts?: AnimatedToastOptions) {
  toast.error(makeMessage(ICONS.error, message), {
    description: opts?.description,
    duration: opts?.duration ?? 4000,
    style: {
      background: "linear-gradient(135deg, #fee2e2, #fecaca)",
      color: "#991b1b",
      border: "1px solid #fca5a5",
      fontWeight: "600",
      borderRadius: "16px",
      direction: "rtl",
    },
  });
}

export function showInfoToast(message: string, opts?: AnimatedToastOptions) {
  toast(makeMessage(ICONS.info, message), {
    description: opts?.description,
    duration: opts?.duration ?? 3000,
    style: {
      background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
      color: "#1e40af",
      border: "1px solid #93c5fd",
      fontWeight: "600",
      borderRadius: "16px",
      direction: "rtl",
    },
  });
}

export function showWarningToast(message: string, opts?: AnimatedToastOptions) {
  toast(makeMessage(ICONS.warning, message), {
    description: opts?.description,
    duration: opts?.duration ?? 3500,
    style: {
      background: "linear-gradient(135deg, #fef9c3, #fde68a)",
      color: "#92400e",
      border: "1px solid #fcd34d",
      fontWeight: "600",
      borderRadius: "16px",
      direction: "rtl",
    },
  });
}
