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
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "greenTicks" INTEGER NOT NULL,
    "annualConsumption" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Aircon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirconDetail" (
    "id" SERIAL NOT NULL,
    "airconId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "btus" INTEGER[],

    CONSTRAINT "AirconDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aircon_model_key" ON "Aircon"("model");

-- CreateIndex
CREATE UNIQUE INDEX "AirconDetail_airconId_key" ON "AirconDetail"("airconId");

-- AddForeignKey
ALTER TABLE "AirconDetail" ADD CONSTRAINT "AirconDetail_airconId_fkey" FOREIGN KEY ("airconId") REFERENCES "Aircon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
