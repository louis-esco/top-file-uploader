/*
  Warnings:

  - You are about to drop the column `rootFolder` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "rootFolder",
ADD COLUMN     "folderId" INTEGER;
