"use client";

import { ReactNode } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ZapCard } from "@/components/ZapCard";
import type { ZapItem } from "@/types/zap";

type ItemCollectionViewProps = {
  title: string;
  description: string;
  items: ZapItem[];
  emptyTitle: string;
  emptyDescription: string;
  icon?: ReactNode;
};

export function ItemCollectionView({
  title,
  description,
  items,
  emptyTitle,
  emptyDescription,
  icon,
}: ItemCollectionViewProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {items.map((item) => (
            <ZapCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} icon={icon} />
      )}
    </section>
  );
}
