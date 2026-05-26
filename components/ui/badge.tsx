import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "green" | "amber" | "red" | "blue" | "violet";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-slate-900/10 text-slate-700",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-sky-100 text-sky-800",
  violet: "bg-violet-100 text-violet-800",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
