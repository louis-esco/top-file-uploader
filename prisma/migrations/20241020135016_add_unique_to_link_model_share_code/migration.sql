/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_shareCode_key" ON "Link"("shareCode");
