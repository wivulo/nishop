/*
  Warnings:

  - Made the column `category` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "Emphasis" BOOLEAN NOT NULL,
    "colors" TEXT NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Product" ("Emphasis", "category", "colors", "description", "id", "imageSrc", "name", "price") SELECT "Emphasis", "category", "colors", "description", "id", "imageSrc", "name", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
