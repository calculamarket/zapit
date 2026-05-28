import type { User, ZapItem } from "@/types/zap";

type ZapRow = {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  tags: string[] | string | null;
  origin: string;
  remote_jid?: string | null;
  important: boolean;
  seen?: boolean;
  created_at: string;
  updated_at: string;
  reminder_at?: string | null;
  archived_at?: string | null;
  completed_at?: string | null;
  summary?: string | null;
  url?: string | null;
  preview_url?: string | null;
  preview?: ZapItem["preview"] | string | null;
  user_id?: string | null;
};

type UserRow = {
  id: string;
  name: string;
  whatsapp_number: string;
  created_at: string;
  updated_at: string;
};

type AppConfigRow = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

function getConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1`,
    key,
  };
}

async function request<T>(path: string, init: RequestInit = {}) {
  const { restUrl, key } = getConfig();
  const response = await fetch(`${restUrl}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Erro Supabase ${response.status}: ${details}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function parseJson<T>(value: T | string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function itemToRow(item: Partial<ZapItem> & { id: string }): Partial<ZapRow> {
  const now = new Date().toISOString();

  return {
    id: item.id,
    title: item.title || "Sem título",
    content: item.content || "",
    type: item.type || "nota",
    category: item.category || "sem-categoria",
    priority: item.priority || "media",
    status: item.status || "entrada",
    tags: item.tags || [],
    origin: item.origin || "Manual",
    remote_jid: item.remoteJid || null,
    important: item.important ?? false,
    created_at: item.createdAt || now,
    updated_at: now,
    reminder_at: item.reminderAt || null,
    archived_at: item.archivedAt || null,
    completed_at: item.completedAt || null,
    summary: item.summary || null,
    url: item.url || null,
    preview_url: item.previewUrl || null,
    preview: item.preview || null,
    user_id: item.userId || null,
  };
}

function rowToItem(row: ZapRow): ZapItem {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type as ZapItem["type"],
    category: row.category as ZapItem["category"],
    priority: row.priority as ZapItem["priority"],
    status: row.status as ZapItem["status"],
    tags: parseJson<string[]>(row.tags, []),
    origin: row.origin as ZapItem["origin"],
    remoteJid: row.remote_jid || undefined,
    important: row.important,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reminderAt: row.reminder_at || undefined,
    archivedAt: row.archived_at || undefined,
    completedAt: row.completed_at || undefined,
    summary: row.summary || undefined,
    url: row.url || undefined,
    previewUrl: row.preview_url || undefined,
    preview: parseJson<ZapItem["preview"] | undefined>(row.preview, undefined),
    userId: row.user_id || undefined,
  };
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    whatsappNumber: row.whatsapp_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getZapsFromSupabase(userId?: string) {
  const userFilter = userId ? `&user_id=eq.${encodeURIComponent(userId)}` : "";
  const rows = await request<ZapRow[]>(
    `/zap_items?select=*&order=created_at.desc${userFilter}`,
  );
  return rows.map(rowToItem);
}

export async function getUsersFromSupabase() {
  const rows = await request<UserRow[]>("/users?select=*&order=name.asc");
  return rows.map(rowToUser);
}

export async function getPendingZapsFromSupabase() {
  const rows = await request<ZapRow[]>("/zap_items?select=*&seen=eq.false&order=created_at.desc");

  if (rows.length > 0) {
    const ids = rows.map((row) => row.id).join(",");
    await request<null>(`/zap_items?id=in.(${ids})`, {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ seen: true, updated_at: new Date().toISOString() }),
    });
  }

  return rows.map(rowToItem);
}

export async function upsertZapInSupabase(item: Partial<ZapItem> & { id: string }) {
  const rows = await request<ZapRow[]>("/zap_items?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(itemToRow(item)),
  });

  return rowToItem(rows[0]);
}

export async function deleteZapFromSupabase(id: string) {
  await request<null>(`/zap_items?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}

export async function updateZapStatusInSupabase(
  id: string,
  status: ZapItem["status"],
  archivedAt?: string,
  completedAt?: string,
) {
  const now = new Date().toISOString();
  const shouldArchive = status === "lido" || status === "arquivado" || status === "concluido";
  const rows = await request<ZapRow[]>(`/zap_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      status,
      archived_at: archivedAt || (shouldArchive ? now : null),
      completed_at: completedAt || (status === "concluido" ? now : null),
      updated_at: now,
    }),
  });

  return rowToItem(rows[0]);
}

export async function getZapWithUserFromSupabase(id: string) {
  const rows = await request<(ZapRow & { users?: UserRow | null })[]>(
    `/zap_items?select=*,users(*)&id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  const row = rows[0];

  if (!row) return null;

  return {
    item: rowToItem(row),
    user: row.users ? rowToUser(row.users) : null,
  };
}

export async function getAppConfigFromSupabase(key: string) {
  const rows = await request<AppConfigRow[]>(
    `/app_config?select=*&key=eq.${encodeURIComponent(key)}&limit=1`,
  );
  return rows[0]?.value ?? null;
}

export async function getUserByWhatsappFromSupabase(whatsappNumber: string) {
  const rows = await request<UserRow[]>(
    `/users?select=*&whatsapp_number=eq.${encodeURIComponent(whatsappNumber)}&limit=1`,
  );
  return rows[0] ? rowToUser(rows[0]) : null;
}
