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
    "winnerName" TEXT NOT NULL,
    "loserName" TEXT NOT NULL,
    "winningScore" INTEGER NOT NULL,
    "losingScore" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerName_fkey" FOREIGN KEY ("winnerName") REFERENCES "players"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_loserName_fkey" FOREIGN KEY ("loserName") REFERENCES "players"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
