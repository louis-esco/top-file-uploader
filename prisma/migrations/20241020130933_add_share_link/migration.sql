-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "rootFolder" INTEGER,
    "authorizedFolders" TEXT[],
    "shareCode" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
