-- CreateTable
CREATE TABLE "estudiantes" (
    "ID_Estudiente" SERIAL NOT NULL,
    "NIE" VARCHAR(30) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Responsable" VARCHAR(150) NOT NULL,
    "Telefono" VARCHAR(30) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("ID_Estudiente")
);

-- CreateTable
CREATE TABLE "grados" (
    "ID_Grado" SERIAL NOT NULL,
    "Nombre_Grado" VARCHAR(100) NOT NULL,

    CONSTRAINT "grados_pkey" PRIMARY KEY ("ID_Grado")
);

-- CreateTable
CREATE TABLE "llegadas_tardes" (
    "ID_Llegadas_Tardes" SERIAL NOT NULL,
    "ID_Estudiente" INTEGER NOT NULL,
    "ID_Grado" INTEGER NOT NULL,
    "Hora_Llegada_Tardia" TIME(6) NOT NULL,
    "Fecha" DATE NOT NULL,
    "Detalle" TEXT,

    CONSTRAINT "llegadas_tardes_pkey" PRIMARY KEY ("ID_Llegadas_Tardes")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_NIE_key" ON "estudiantes"("NIE");

-- CreateIndex
CREATE UNIQUE INDEX "grados_Nombre_Grado_key" ON "grados"("Nombre_Grado");

-- AddForeignKey
ALTER TABLE "llegadas_tardes" ADD CONSTRAINT "llegadas_tardes_ID_Estudiente_fkey" FOREIGN KEY ("ID_Estudiente") REFERENCES "estudiantes"("ID_Estudiente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llegadas_tardes" ADD CONSTRAINT "llegadas_tardes_ID_Grado_fkey" FOREIGN KEY ("ID_Grado") REFERENCES "grados"("ID_Grado") ON DELETE RESTRICT ON UPDATE CASCADE;
