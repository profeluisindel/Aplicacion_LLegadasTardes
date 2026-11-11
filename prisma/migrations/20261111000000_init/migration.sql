CREATE TABLE "Estudiantes" (
    "ID_Estudiente" SERIAL NOT NULL,
    "NIE" TEXT NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Responsable" TEXT NOT NULL,
    "Telefono" TEXT NOT NULL,

    CONSTRAINT "Estudiantes_pkey" PRIMARY KEY ("ID_Estudiente")
);

CREATE TABLE "Grados" (
    "ID_Grado" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,

    CONSTRAINT "Grados_pkey" PRIMARY KEY ("ID_Grado")
);

CREATE TABLE "LlegadasTardes" (
    "Id_Llegadas_Tardes" SERIAL NOT NULL,
    "ID_Estudiente" INTEGER NOT NULL,
    "ID_Grado" INTEGER NOT NULL,
    "Hora_Llegada" TIME(0) NOT NULL,
    "Fecha" DATE NOT NULL,
    "Detalle" TEXT NOT NULL,

    CONSTRAINT "LlegadasTardes_pkey" PRIMARY KEY ("Id_Llegadas_Tardes")
);

ALTER TABLE "LlegadasTardes"
    ADD CONSTRAINT "LlegadasTardes_ID_Estudiente_fkey"
    FOREIGN KEY ("ID_Estudiente") REFERENCES "Estudiantes"("ID_Estudiente")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "LlegadasTardes"
    ADD CONSTRAINT "LlegadasTardes_ID_Grado_fkey"
    FOREIGN KEY ("ID_Grado") REFERENCES "Grados"("ID_Grado")
    ON DELETE RESTRICT ON UPDATE CASCADE;
