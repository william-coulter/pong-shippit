-- CreateTable
CREATE TABLE "Player" (
    "name" TEXT NOT NULL,
    "elo" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player_1_name" TEXT NOT NULL,
    "player_1_score" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player_1_name_fkey" FOREIGN KEY ("player_1_name") REFERENCES "Player"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
