/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reactions_postId_userId_key" ON "reactions"("postId", "userId");
