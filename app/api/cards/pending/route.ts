import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZapItem } from "@/types/zap";

function serializeItem(item: any): ZapItem {
  return {
    ...item,
    tags: JSON.parse(item.tags || "[]"),
    preview: item.preview ? JSON.parse(item.preview) : undefined,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    reminderAt: item.reminderAt?.toISOString(),
    archivedAt: item.archivedAt?.toISOString(),
    completedAt: item.completedAt?.toISOString(),
  };
}

export async function GET() {
  try {
    const pending = await prisma.zapItem.findMany({
      where: { seen: false },
    });

    if (pending.length > 0) {
      await prisma.zapItem.updateMany({
        where: { id: { in: pending.map((p) => p.id) } },
        data: { seen: true },
      });
    }

    return NextResponse.json({ cards: pending.map(serializeItem) });
  } catch (error) {
    console.error("Failed to fetch pending cards:", error);
    return NextResponse.json({ cards: [] });
  }
}
