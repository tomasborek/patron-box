-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stationId" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenRecord" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceId" INTEGER NOT NULL,

    CONSTRAINT "OpenRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_reservationId_key" ON "Record"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Record_userId_key" ON "Record"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Record_stationId_key" ON "Record"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenRecord_referenceId_key" ON "OpenRecord"("referenceId");

-- AddForeignKey
ALTER TABLE "OpenRecord" ADD CONSTRAINT "OpenRecord_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
