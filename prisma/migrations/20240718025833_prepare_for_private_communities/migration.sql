-- CreateTable
CREATE TABLE "_SubscribedCommunities" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SubscribedCommunities_A_fkey" FOREIGN KEY ("A") REFERENCES "Community" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubscribedCommunities_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubscribedCommunities_AB_unique" ON "_SubscribedCommunities"("A", "B");

-- CreateIndex
CREATE INDEX "_SubscribedCommunities_B_index" ON "_SubscribedCommunities"("B");
