import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/90 bg-white/60 px-5 py-8 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600">{description}</p>
    </div>
  );
}
