# Turnia Frontend

Aplicación web del prototipo Turnia, un sistema de gestión de turnos. Incluye la administración de usuarios, servicios y counters, la interfaz donde los trabajadores llaman y atienden los tickets, y la pantalla de TV que muestra el turno llamado.

El proyecto se completa con [turnia-backend](https://github.com/Milton090/turnia-backend) y [turnia-kiosk](https://github.com/Milton090/turnia-kiosk).

Está publicada en https://turnia-demo.netlify.app/#/

## Tecnologías

Quasar 2 con Vue 3, Pinia, Axios y SignalR.

## Cómo correrlo

Necesita Node.js 20 o superior y el backend corriendo en local.

```powershell
npm install
npm run dev
```

Queda en http://localhost:9000. Para generar la versión de producción se usa `npm run build` y el resultado queda en `dist/spa`.

La URL del backend se define al inicio de `quasar.config.js`. `API_URL_LOCAL` es la que usa `npm run dev` y `API_URL_PRODUCCION` la que usa `npm run build`.

## Pantallas

| Pantalla | Ruta |
|---|---|
| Inicio de sesión | `/#/` |
| Interfaz del trabajador | `/#/queuescreen` |
| Usuarios | `/#/configuration/users` |
| Servicios | `/#/configuration/services` |
| Counters | `/#/configuration/counters` |
| Pantalla de TV | `/#/queueviewerscreen` |

La pantalla de TV pide su clave la primera vez, que es `turnia-pantalla-demo`.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin@turnia.local | Admin2026* | Administrador |
| trabajador1@turnia.local | Turnia2026* | Trabajador en el Counter 1 |
| trabajador2@turnia.local | Turnia2026* | Trabajador en el Counter 2 |

## Estructura

`src/pages` tiene las páginas y `src/components` sus componentes. En `src/layouts` está el menú principal con la conexión a SignalR, en `src/stores` el estado con Pinia y en `src/boot/axios.js` el cliente HTTP.
