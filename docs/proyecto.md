# Concepto y decisiones

## Objetivo y uso

Un pequeño espacio visual para alternar concentración y descanso. El modo fija inicialmente 25 o 5 minutos; puede elegirse cualquier múltiplo de 5 entre 5 y 60. Los controles permiten iniciar, pausar, reanudar y reiniciar. Cambiar la duración o el modo prepara una sesión nueva. La interfaz indica preparado, en curso, pausado o completado; no encadena sesiones.

Se dirige a estudiantes y personas que trabajan frente al ordenador y quieren organizar periodos de concentración y descanso con una herramienta visual sencilla.

Casos de uso: iniciar una sesión de concentración; seleccionar descanso; pausar y reanudar; cambiar la duración; cerrar y volver a abrir el popup para recuperar la sesión; y reiniciarla cuando se quiera empezar de nuevo.

## Adaptación del original

Se han examinado `index.html`, `sketch.js`, `style.css`, `libraries` y `assets` del proyecto de referencia. Su `coloresHora` aporta los 24 colores originales; el color sigue la hora local. `dibujarAstro` conserva su trayectoria curva y sus círculos luminosos. `dibujarMarea` conserva la superficie sinusoidal y el relleno, pero el nivel representa el porcentaje transcurrido de la sesión en lugar del minuto de la hora. `dibujarPulso` sigue los segundos sobre la ola. Se han ajustado tamaños y contraste a 300 × 150 y se ha omitido la leyenda de 24 horas y la firma del canvas para preservar legibilidad. La fuente original de `assets` no es necesaria en el nuevo canvas y no se ha copiado.

La biblioteca local original identifica la versión p5.js 2.3.4; se ha copiado idéntica, sin CDN. Los scripts de la aplicación están en archivos externos. El estudiante ha comunicado que la extensión se carga y el canvas se visualiza correctamente en Firefox; queda pendiente revisar la consola y repetir la prueba tras los últimos cambios.

## Persistencia y estados

`storeItem()` y `getItem()` de p5 guardan y leen un objeto versionado en `localStorage`: modo, duración, estado, milisegundos restantes y fecha absoluta de fin cuando está en curso. Al iniciar o reanudar se fija `endAt = Date.now() + remaining`. Al reabrir, se resta la hora actual; si ya venció, se marca completado. Al pausar se calcula el resto y se elimina la fecha de fin, por lo que el tiempo pausado no se descuenta. Se comprueban versión, tipos, valores, límites y coherencia antes de restaurar; un valor inválido vuelve a concentración de 25 minutos. Las transiciones y la finalización se guardan, no cada fotograma. El reloj del sistema afecta al cálculo si se cambia manualmente.

`localStorage` es el almacenamiento web del contexto de la extensión, utilizado aquí por p5. `browser.storage` es una API asíncrona propia de extensiones y requiere el permiso `storage`; este permiso se incluye por el enunciado, no porque lo necesite por sí mismo `localStorage`. Firefox puede borrar datos de `localStorage` al limpiar datos de navegación, a diferencia de `storage.local` en los casos descritos por Mozilla. Si el almacenamiento falla se muestra un aviso; no se garantiza continuidad en ese caso.

Al recuperar una sesión activa, la fecha de fin no puede quedar más lejos que el tiempo restante guardado; si sucede, se restaura el estado inicial seguro. Esto también puede ocurrir si se atrasa el reloj del sistema mientras el popup está cerrado. Adelantarlo puede hacer que la sesión parezca terminada antes. No se dispone de una fuente de tiempo independiente.

## Vuelta de tuerca: notificación (propuesta, no implementada)

Para avisar con el popup cerrado haría falta un script de fondo no persistente, persistencia compartida (preferiblemente `browser.storage.local`) y una alarma de `browser.alarms` programada para el fin; cancelar o ajustar la alarma al pausar, reiniciar o cambiar preferencias, y comprobar el estado antes de notificar mediante `browser.notifications.create`. Requeriría los permisos `alarms` y `notifications`, además de gestionar reinicios del navegador y límites de precisión de las alarmas. Ninguno de esos componentes o permisos se ha añadido. No se garantiza aviso con el navegador cerrado.

## Registro verificable

- El primer examen encontró la carpeta vacía y se detuvo por falta del original; posteriormente apareció `marea-del-tiempo-original` y se usó en lectura.
- El original usa p5 2.3.4 local; el archivo copiado se contrastó mediante SHA-256. No se copiaron dependencias de desarrollo ni repositorio.
- Una fecha de fin evita depender de que siga abierto el popup; una pausa guarda el resto y suprime la fecha de fin.
- El canvas carece de texto pequeño; las etiquetas y botones son DOM para facilitar su uso con teclado y tecnologías de asistencia.
- Los textos españoles dañados ya contenían signos de interrogación en el código fuente; se corrigieron y se comprobó UTF-8.
- Una función propia llamada `save()` coincidía con la función global de p5 y provocaba la descarga del canvas. Se renombró a `guardarEstadoSesion()` y se añadió una prueba de regresión.
- La fecha de fin se comprueba al restaurar para rechazar fechas futuras incoherentes. El contador solo cambia su texto cuando cambia el segundo mostrado; los cambios de estado se anuncian por separado.
- El estudiante comunicó pruebas satisfactorias en Firefox; deben repetirse las comprobaciones pertinentes tras los últimos cambios. `web-ext` no se encontró en las comprobaciones anteriores.

## Pendiente para la memoria y Folio

Incorporar los bocetos hechos a mano y capturas reales de Firefox; preparar la reflexión personal del aprendizaje y la declaración del uso de ChatGPT y Codex; elaborar el PDF y publicarlo en Folio. Estas tareas requieren la participación del estudiante y todavía no se han realizado.

## Fuentes técnicas

- [p5.js: storeItem](https://p5js.org/reference/p5/storeItem/) y [getItem](https://p5js.org/reference/p5/getItem/).
- [Mozilla: manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) y [primera extensión e instalación temporal](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).
- [Mozilla: API storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage).
- [Mozilla: scripts de fondo](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts), [alarms](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms) y [notifications](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications).
