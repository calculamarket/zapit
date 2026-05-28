import { NextResponse } from "next/server";
import { getPendingZapsFromSupabase } from "@/lib/supabase-data";

export async function GET() {
  try {
    const cards = await getPendingZapsFromSupabase();
    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Failed to fetch pending cards:", error);
    return NextResponse.json({ cards: [] });
  }
}
