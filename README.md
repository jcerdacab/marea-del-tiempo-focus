# Marea del tiempo — Focus

Extensión para Firefox creada para el Reto 3 de Desarrollo de Aplicaciones Interactivas de la UOC. Ayuda a organizar periodos de concentración y descanso mediante un temporizador y una animación sencilla.

El proyecto adapta «Marea del tiempo», un reloj creativo del Reto 1: conserva su paleta de 24 horas, el astro, las olas y el pulso luminoso. En esta versión, la altura de la marea representa el avance de la sesión.

## Funciones

- Modo concentración de 25 minutos y descanso de 5 minutos por defecto.
- Duración ajustable entre 5 y 60 minutos, en pasos de 5.
- Controles para iniciar, pausar, reanudar y reiniciar.
- Recuperación de la sesión al cerrar y volver a abrir el popup.
- Indicación del tiempo restante y del estado. Al terminar no se inicia otra sesión automáticamente.

La extensión no envía notificaciones ni necesita ejecutar la animación con el popup cerrado.

## Tecnologías

HTML, CSS, JavaScript, p5.js 2.3.4 y Firefox WebExtensions con Manifest V3. La biblioteca p5.js se incluye en el proyecto y no se carga desde una CDN.

## Carga temporal en Firefox

1. Abre Firefox y visita `about:debugging`.
2. Selecciona «Este Firefox» y pulsa «Cargar complemento temporal».
3. Selecciona el archivo `manifest.json` de la carpeta del proyecto.
4. Abre la extensión desde la barra de Firefox. Para aplicar cambios en los archivos, recárgala desde `about:debugging`.

La instalación temporal desaparece al cerrar Firefox.

## Uso

Elige concentración o descanso y, si lo deseas, cambia la duración. Pulsa **Iniciar**; puedes pausar y reanudar la sesión. **Reiniciar** vuelve a preparar la duración seleccionada. Cambiar de modo o duración prepara una sesión nueva. Después de completar una sesión, pulsa **Reiniciar** y luego **Iniciar** para comenzar otra.

## Almacenamiento

La extensión utiliza `storeItem()` y `getItem()` de p5.js para guardar y recuperar el estado en `localStorage`. Al iniciar o reanudar se guarda una fecha de fin; al reabrir el popup se calcula el tiempo restante. Una sesión pausada conserva su tiempo. El permiso `storage` se incluye por el enunciado y corresponde a `browser.storage`; no es necesario por sí mismo para usar `localStorage`.

## Estructura

```text
marea-del-tiempo-focus/
├── manifest.json
├── index.html
├── style.css
├── timer.js
├── app.js
├── sketch.js
├── libraries/
│   ├── p5.min.js
│   ├── p5-LICENSE.txt
│   └── p5-THIRD-PARTY-NOTICES.txt
├── docs/
│   ├── proyecto.md
│   └── pruebas.md
├── tests/
│   ├── timer.test.js
│   └── ui-regression.test.js
├── .gitignore
├── LICENSE
└── README.md
```

Los archivos de la raíz utilizados por `index.html`, `manifest.json` y `libraries/p5.min.js` ejecutan la extensión. `docs/` y `tests/` contienen documentación y pruebas de desarrollo. La licencia de p5 debe acompañar a la biblioteca en cualquier distribución.

Para ejecutar las pruebas con Node.js desde esta carpeta:

```text
node tests/timer.test.js
node tests/ui-regression.test.js
```

Los resultados y las comprobaciones pendientes están en [docs/pruebas.md](docs/pruebas.md); el concepto y las decisiones, en [docs/proyecto.md](docs/proyecto.md).

## Licencia y reconocimiento

El código original de este proyecto se ofrece bajo la [licencia MIT](LICENSE), con copyright de Juan Antonio Cerdá Cabanes, 2026.

La biblioteca incluida [p5.js](https://p5js.org/) 2.3.4 es un proyecto de sus colaboradores y de la Processing Foundation, creado por Lauren Lee McCarthy. Se distribuye bajo la **GNU LGPL 2.1**, no bajo la licencia MIT de este proyecto. Su texto se conserva en [libraries/p5-LICENSE.txt](libraries/p5-LICENSE.txt); el [código fuente de la versión 2.3.4](https://github.com/processing/p5.js/tree/v2.3.4) está disponible en el repositorio oficial. Las condiciones y avisos de p5.js se mantienen separados de los del código propio.

Los avisos de las dependencias y los avisos incluidos en la versión sin minificar se recogen en [libraries/p5-THIRD-PARTY-NOTICES.txt](libraries/p5-THIRD-PARTY-NOTICES.txt) y deben acompañar a la biblioteca al distribuirla.
