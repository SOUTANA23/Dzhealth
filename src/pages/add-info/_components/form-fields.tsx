/**
 * Shared form field components used across Add* pages
 */
import { cn } from "@/lib/utils.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { WILAYAS } from "@/lib/data.ts";
import { motion } from "motion/react";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <FormField label={label}>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl"
        required={required}
      />
    </FormField>
  );
}

export function TextareaInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <FormField label={label}>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl resize-none"
        rows={3}
      />
    </FormField>
  );
}

export function WilayaSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <FormField label="الولاية">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-xl border border-border bg-card text-sm px-3 outline-none text-foreground cursor-pointer"
      >
        {WILAYAS.map((w) => (
          <option key={w.code} value={w.code}>{w.ar}</option>
        ))}
      </select>
    </FormField>
  );
}

export function ToggleChips<T extends string>({
  label,
  options,
  value,
  onChange,
  colorFn,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  colorFn?: (v: T, active: boolean) => string;
}) {
  return (
    <FormField label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          const cls = colorFn
            ? colorFn(opt.value, active)
            : active
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-card border border-border text-foreground";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer", cls)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn("w-12 h-6 rounded-full transition-colors cursor-pointer relative", value ? "bg-primary" : "bg-border")}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 } as const}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
