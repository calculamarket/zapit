"use client";

import { useEffect, useRef } from "react";
import type { ZapItem } from "@/types/zap";

const POLL_MS = 5000;

export function useEvolutionPolling(onNewCards: (cards: ZapItem[]) => void) {
  const callbackRef = useRef(onNewCards);
  callbackRef.current = onNewCards;

  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) return;
      try {
        const res = await fetch("/api/cards/pending");
        if (!res.ok) return;
        const { cards }: { cards: ZapItem[] } = await res.json();
        if (cards.length > 0) callbackRef.current(cards);
      } catch {
        // ignore transient network errors
      }
    }

    const id = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);
}
