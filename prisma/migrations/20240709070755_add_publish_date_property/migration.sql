/*
  Warnings:

  - Added the required column `publishedDate` to the `DiscussionThread` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscussionThread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedDate" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    CONSTRAINT "DiscussionThread_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscussionThread_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiscussionThread" ("bookId", "createdAt", "createdById", "id", "title", "updatedAt") SELECT "bookId", "createdAt", "createdById", "id", "title", "updatedAt" FROM "DiscussionThread";
DROP TABLE "DiscussionThread";
ALTER TABLE "new_DiscussionThread" RENAME TO "DiscussionThread";
CREATE INDEX "DiscussionThread_title_idx" ON "DiscussionThread"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
