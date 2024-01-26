-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "Emphasis" BOOLEAN NOT NULL,
    "colors" TEXT NOT NULL
);
