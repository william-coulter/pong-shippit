-- CreateTable
CREATE TABLE "players" (
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "elo" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winningScore" INTEGER NOT NULL,
    "losingScore" INTEGER NOT NULL,
    "winnerName" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameToPlayer" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameToPlayer_AB_unique" ON "_GameToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToPlayer_B_index" ON "_GameToPlayer"("B");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerName_fkey" FOREIGN KEY ("winnerName") REFERENCES "players"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToPlayer" ADD FOREIGN KEY ("A") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToPlayer" ADD FOREIGN KEY ("B") REFERENCES "players"("name") ON DELETE CASCADE ON UPDATE CASCADE;
