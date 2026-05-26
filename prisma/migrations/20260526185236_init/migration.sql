-- CreateTable
CREATE TABLE "ZapItem" (
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
