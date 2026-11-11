# Colegio La Pulida · FrontEnd

Interfaz React para administrar estudiantes, grados y llegadas tardías mediante la API Express.

## Inicio

1. Inicia el backend desde la raíz con `npm start` (API en `http://localhost:3000`).
2. Desde `FrontEnd/`, instala dependencias con `npm install` y arranca Vite con `npm run dev`.
3. Abre la URL local que muestra Vite.

La URL de la API se configura con `VITE_API_URL`; su valor por defecto es `http://localhost:3000/api`. Para personalizarla, copia `.env.example` como `.env` y modifica el valor.

## Validar la compilación

```bash
npm run build
npm run lint
```
