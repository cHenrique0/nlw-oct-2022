/*
  Warnings:

  - You are about to drop the column `firstTeamPoints` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `secondTeamPoints` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `firstTeamCountryIsoCode` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `secondTeamCountryIsoCode` on the `Match` table. All the data in the column will be lost.
  - Added the required column `awayTeamGoals` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamGoals` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `awayTeamCountryIsoCode` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamCountryIsoCode` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homeTeamGoals" INTEGER NOT NULL,
    "awayTeamGoals" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    CONSTRAINT "Guess_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("createdAt", "id", "matchId", "participantId") SELECT "createdAt", "id", "matchId", "participantId" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
CREATE UNIQUE INDEX "Guess_participantId_matchId_key" ON "Guess"("participantId", "matchId");
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "homeTeamCountryIsoCode" TEXT NOT NULL,
    "awayTeamCountryIsoCode" TEXT NOT NULL
);
INSERT INTO "new_Match" ("date", "id") SELECT "date", "id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
