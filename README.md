# Invitación · Boda de Ruth & David

- Invitados: https://doldanedison.github.io/boda-ruth-david/
- Organizador: https://doldanedison.github.io/boda-ruth-david/organizador.html

| Archivo | Para qué |
|---|---|
| `index.html` | Lo que ven los invitados: sobre de inicio, datos de la boda y confirmación |
| `organizador.html` | Panel para cargar invitaciones, editar el itinerario y ver quién confirmó (pide clave) |
| `config.js` | Datos de la boda (nombres, fecha, lugar, vestimenta, alias) y URL de la planilla |
| `art.js` | Dibujos SVG: sobre, sello, orquídeas |
| `api.js` | Conexión con la planilla y búsqueda tolerante de nombres |
| `Code.gs` | Backend gratis en Google Sheets (Apps Script) |
| `musica.mp3` | Música de fondo. Si el archivo no está, el botón de música no aparece |
| `portada.jpg` | Imagen de la vista previa al compartir el enlace; se genera desde `portada.html` (1200x630) |

## Cambiar datos

- **Textos, fecha, lugar, alias**: editá `config.js`.
- **Itinerario**: se edita desde el panel del organizador, sin tocar archivos. Mientras esté vacío, los invitados ven «Muy pronto vamos a compartir el itinerario».
- **Música**: subí el archivo con el nombre `musica.mp3`.

## Conectar la planilla de Google

GitHub Pages solo sirve archivos, no guarda datos, así que la lista vive en una planilla de Google.

1. Creá una planilla nueva en Google Sheets.
2. Creá un proyecto de Apps Script y pegá el contenido de `Code.gs`.
3. Cambiá `CLAVE_ORGANIZADOR` por una clave tuya y poné en `SHEET_ID` el ID de la planilla.
4. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
5. Autorizá los permisos y copiá la URL que termina en `/exec`.
6. Pegala en `API_URL` dentro de `config.js`.

Sin `API_URL` la página anda en **modo demo** (los datos quedan solo en ese navegador).

## Uso

- **Invitaciones**: cada una tiene un titular, acompañantes con nombre (opcional) y la cantidad total de acompañantes. «Hebert Verón + Aylen de Verón, Hiram Verón» son 3 lugares.
- **Invitados**: tocan *Confirmar asistencia*, escriben su nombre y marcan quiénes van. La búsqueda encuentra por el titular o por cualquier acompañante con nombre, y tolera errores de escritura.
- `index.html#info` abre directo la invitación, sin el sobre.
