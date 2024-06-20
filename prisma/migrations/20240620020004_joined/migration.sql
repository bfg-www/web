-- CreateTable
CREATE TABLE "Nea" (
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "greenTicks" INTEGER NOT NULL,
    "annualConsumption" INTEGER NOT NULL,

    CONSTRAINT "Nea_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Sale" (
    "model" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Aircon" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "greenTicks" INTEGER NOT NULL,
    "annualConsumption" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Aircon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aircon_model_key" ON "Aircon"("model");
