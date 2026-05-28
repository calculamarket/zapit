"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getZaps, upsertZap, deleteZap, updateZapStatus, getUsers } from "@/app/actions/zap";
import { archiveZapItem, receiveWhatsAppMessage } from "@/lib/zap-classifier";
import { useEvolutionPolling } from "@/lib/hooks/use-evolution-polling";
import type { WhatsAppMessageInput, ZapItem, ZapView, User } from "@/types/zap";

type ZapContextValue = {
  items: ZapItem[];
  users: User[];
  currentUser: User | null;
  isHydrated: boolean;
  activeView: ZapView;
  globalSearch: string;
  setActiveView: (view: ZapView) => void;
  setGlobalSearch: (query: string) => void;
  setCurrentUser: (user: User | null) => void;
  addFromWhatsApp: (input: WhatsAppMessageInput) => Promise<ZapItem>;
  addItems: (cards: ZapItem[]) => void;
  updateItem: (id: string, patch: Partial<ZapItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleImportant: (id: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  completeItem: (id: string) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
  keepItem: (id: string) => Promise<void>;
  addTag: (id: string, tag: string) => Promise<void>;
  removeTag: (id: string, tag: string) => Promise<void>;
  resetSamples: () => void;
  clearAll: () => void;
};

const ZapContext = createContext<ZapContextValue | null>(null);

export function ZapProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ZapItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeView, setActiveView] = useState<ZapView>("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");

  const refreshItems = useCallback(async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      
      // Default to first user if not set
      const initialUser = currentUser || usersData[0] || null;
      if (!currentUser && initialUser) {
        setCurrentUser(initialUser);
      }

      const data = await getZaps(initialUser?.id);
      setItems(data);
      setIsHydrated(true);
    } catch (error) {
      console.error("Failed to fetch zaps:", error);
      setIsHydrated(true);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  const addFromWhatsApp = useCallback(async (input: WhatsAppMessageInput) => {
    const newItem = receiveWhatsAppMessage(input);
    if (currentUser) {
      newItem.userId = currentUser.id;
    }
    const saved = await upsertZap(newItem);
    setItems((current) => [saved, ...current]);
    return saved;
  }, [currentUser]);

  const addItems = useCallback((cards: ZapItem[]) => {
    setItems((current) => {
      const existingIds = new Set(current.map((i) => i.id));
      // Filter items for current user if polling returns all
      const userItems = currentUser ? cards.filter(c => c.userId === currentUser.id) : cards;
      const newItems = userItems.filter((c) => !existingIds.has(c.id));
      return [...newItems, ...current];
    });
  }, [currentUser]);

  useEvolutionPolling(addItems);

  const updateItem = useCallback(
    async (id: string, patch: Partial<ZapItem>) => {
      setItems((current) => {
        const existing = current.find((i) => i.id === id);
        if (!existing) return current;
        const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
        
        // Background sync
        upsertZap(updated).catch(console.error);
        
        return current.map((item) => (item.id === id ? updated : item));
      });
    },
    [],
  );

  const deleteItem = useCallback(async (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    await deleteZap(id);
  }, []);

  const toggleImportant = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const updated = { ...item, important: !item.important, updatedAt: new Date().toISOString() };
          upsertZap(updated).catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const markRead = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const now = new Date().toISOString();
          const updated = { ...item, status: "lido" as const, archivedAt: now, updatedAt: now };
          updateZapStatus(id, "lido").catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const completeItem = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const now = new Date().toISOString();
          const updated = {
            ...item,
            status: "concluido" as const,
            completedAt: now,
            archivedAt: now,
            updatedAt: now,
          };
          updateZapStatus(id, "concluido").catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const archiveItem = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const updated = archiveZapItem(item);
          updateZapStatus(id, "arquivado").catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const keepItem = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            status: "ativo" as const,
            archivedAt: undefined,
            completedAt: undefined,
            updatedAt: new Date().toISOString(),
          };
          updateZapStatus(id, "ativo").catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const addTag = useCallback(async (id: string, tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized) return;

    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            tags: Array.from(new Set([...item.tags, normalized])).slice(0, 8),
            updatedAt: new Date().toISOString(),
          };
          upsertZap(updated).catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const removeTag = useCallback(async (id: string, tag: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            tags: item.tags.filter((itemTag) => itemTag !== tag),
            updatedAt: new Date().toISOString(),
          };
          upsertZap(updated).catch(console.error);
          return updated;
        }
        return item;
      }),
    );
  }, []);

  const resetSamples = useCallback(() => {
    // For now, resetSamples won't clear the DB unless specifically asked
    setActiveView("dashboard");
    setGlobalSearch("");
  }, []);

  const clearAll = useCallback(() => {
    // This should probably delete all from DB
    setItems([]);
    setGlobalSearch("");
    // We could add a clearAllZaps action if needed
  }, []);

  const value = useMemo(
    () => ({
      items,
      users,
      currentUser,
      isHydrated,
      activeView,
      globalSearch,
      setActiveView,
      setGlobalSearch,
      setCurrentUser,
      addFromWhatsApp,
      addItems,
      updateItem,
      deleteItem,
      toggleImportant,
      markRead,
      completeItem,
      archiveItem,
      keepItem,
      addTag,
      removeTag,
      resetSamples,
      clearAll,
    }),
    [
      items,
      users,
      currentUser,
      isHydrated,
      activeView,
      globalSearch,
      addFromWhatsApp,
      addItems,
      updateItem,
      deleteItem,
      toggleImportant,
      markRead,
      completeItem,
      archiveItem,
      keepItem,
      addTag,
      removeTag,
      resetSamples,
      clearAll,
    ],
  );

  return <ZapContext.Provider value={value}>{children}</ZapContext.Provider>;
}

export function useZapStore() {
  const context = useContext(ZapContext);

  if (!context) {
    throw new Error("useZapStore must be used inside ZapProvider");
  }

  return context;
}
