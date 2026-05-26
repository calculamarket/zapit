-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ZapItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reminderAt" DATETIME,
    "archivedAt" DATETIME,
    "completedAt" DATETIME,
    "summary" TEXT,
    "url" TEXT,
    "previewUrl" TEXT,
    "preview" TEXT
);
INSERT INTO "new_ZapItem" ("archivedAt", "category", "completedAt", "content", "createdAt", "id", "important", "origin", "preview", "previewUrl", "priority", "reminderAt", "status", "summary", "tags", "title", "type", "updatedAt", "url") SELECT "archivedAt", "category", "completedAt", "content", "createdAt", "id", "important", "origin", "preview", "previewUrl", "priority", "reminderAt", "status", "summary", "tags", "title", "type", "updatedAt", "url" FROM "ZapItem";
DROP TABLE "ZapItem";
ALTER TABLE "new_ZapItem" RENAME TO "ZapItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
