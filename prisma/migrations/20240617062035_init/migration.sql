-- CreateTable
CREATE TABLE "Aircon" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "greenTicks" INTEGER NOT NULL,
    "annualConsumption" INTEGER NOT NULL,

    CONSTRAINT "Aircon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aircon_model_key" ON "Aircon"("model");
