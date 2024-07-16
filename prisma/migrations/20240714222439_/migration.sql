/*
  Warnings:

  - You are about to drop the `_JoinedThreads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bookId` on the `DiscussionThread` table. All the data in the column will be lost.
  - You are about to drop the column `publishedDate` on the `DiscussionThread` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BookReview_content_idx";

-- DropIndex
DROP INDEX "_JoinedThreads_B_index";

-- DropIndex
DROP INDEX "_JoinedThreads_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_JoinedThreads";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Community" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "accessCode" TEXT,
    CONSTRAINT "Community_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CommunityToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CommunityToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Community" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CommunityToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscussionThread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "communityId" INTEGER,
    CONSTRAINT "DiscussionThread_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscussionThread_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DiscussionThread" ("createdAt", "createdById", "id", "title", "updatedAt") SELECT "createdAt", "createdById", "id", "title", "updatedAt" FROM "DiscussionThread";
DROP TABLE "DiscussionThread";
ALTER TABLE "new_DiscussionThread" RENAME TO "DiscussionThread";
CREATE INDEX "DiscussionThread_title_idx" ON "DiscussionThread"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToGenre_AB_unique" ON "_CommunityToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToGenre_B_index" ON "_CommunityToGenre"("B");
