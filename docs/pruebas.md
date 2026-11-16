# Pruebas y revisión

## Ejecutadas

- `node tests/timer.test.js`: correcto. Comprueba inicio y avance, pausa durante cierre simulado, reanudación, restauración en curso y después del vencimiento, reinicio, cambio de modo y duración, datos inválidos, fechas incoherentes, reloj atrasado y límites.
- `node --check` para `timer.js`, `app.js`, `sketch.js` y ambos archivos de pruebas: correcto.
- Análisis JSON: manifest V3, permiso `storage`, popup y rutas de CSS y scripts existentes: correcto.
- SHA-256 de la biblioteca copiada comparado con la del original: idéntico; cabecera de la biblioteca indica 2.3.4.

Estas pruebas de lógica simulan el tiempo y no prueban interacciones reales ni el almacenamiento del navegador.

## Regresión de descargas involuntarias

- `node tests/ui-regression.test.js`: correcto. Simula la instalación global de `save` por p5, los eventos de modo, duración y botones, la persistencia y reapertura, la finalización y una llamada al dibujo; no se llama a `save` de p5. También comprueba que el contador no se reescribe cuando no cambia el segundo. El DOM, el almacenamiento, el dibujo y la descarga están simulados.
- Sintaxis JavaScript, manifiesto y rutas: correctos. No hay llamadas a `save`, `saveCanvas` ni `saveFrames` en los scripts propios.
## Pruebas manuales comunicadas por el estudiante

El estudiante comunicó resultados satisfactorios para instalación temporal, visualización del canvas, inicio, pausa y reanudación, reinicio, cambio de concentración a descanso, persistencia al cerrar y reabrir el popup y ausencia de descargas PNG después de la corrección. No son pruebas ejecutadas por Codex.

## Pendientes en Firefox

- Tras los últimos cambios, recargar la extensión y volver a comprobar consola, animación, botones y contador.
- Comprobar foco por teclado, contraste, aumento de texto y ausencia de recortes o scroll innecesario; probar el contador y los cambios de estado con un lector de pantalla.
- Repetir cierre y reapertura en curso, pausado y tras finalizar; comprobar la restauración con una fecha incoherente y que una sesión finalizada no se reinicia sola.
- Comprobar el aviso si el almacenamiento no está disponible y el comportamiento con datos corruptos reales.
- Ejecutar `web-ext lint` si se dispone de él; no se encontró en las comprobaciones anteriores.
