# AN.NUM — Frontend

Herramienta de análisis numérico con graficadora interactiva.

**Deploy:** https://imsaee.github.io/AN.NUM---FRONTEND/

---

## Bitácora de cambios

| Fecha | Componente | Cambio | Detalle |
|-------|-----------|--------|---------|
| 2026-05-31 | `robledo-graficadora` | `823c2f5` — Consola de diagnóstico con historial (`consola.js`) | [ver →](docs/823c2f5.md) |

### Cómo documentar un cambio

1. Hacer el commit normalmente con `git commit`
2. Copiar el ID corto del commit (los 7 caracteres que muestra git, ej. `823c2f5`)
3. Crear el archivo `docs/<id_commit>.md` con este formato:
   ```markdown
   # `id_commit` — YYYY-MM-DD

   ### componente: título del cambio

   **Archivos modificados:**
   - `ruta/archivo.js` — qué se hizo

   **Qué hace:**
   Explicación breve del cambio.
   ```
4. Agregar una fila a la tabla de arriba en este README:
   ```
   | YYYY-MM-DD | `carpeta` | `id_commit` — resumen corto | [ver →](docs/id_commit.md) |
   ```
5. Hacer commit solo con la documentación: `git add README.md docs/<id_commit>.md`

---

## Software principal

Calculadora de métodos numéricos para búsqueda de raíces, desarrollada por Wilson. Permite ingresar una función f(x), elegir un método y visualizar el resultado en una gráfica.

**Métodos disponibles:** Bisección, Regula Falsi, Newton-Raphson, Secante, Punto Fijo.

**Software de terceros:**
- [math.js](https://mathjs.org/) — evaluación y derivación simbólica de funciones
- [Chart.js](https://www.chartjs.org/) — gráfica de la función y marcado de la raíz

---

## Refactor de arquitectura

> **Este refactor es una maqueta — no modifica el software principal.** El `script.js` y el `index.html` originales de Wilson no fueron tocados y siguen funcionando de forma independiente.

Los métodos numéricos que Wilson desarrolló en `script.js` fueron separados en archivos individuales dentro de la carpeta `metodos-numericos/`, un archivo por método. El objetivo es que cada archivo contenga únicamente la lógica matemática, sin ninguna referencia al DOM ni a la interfaz. De esta forma el HTML actúa como un visualizador simple que no piensa — solo llama al método, recibe el resultado y lo muestra.

Estos archivos son los que utiliza la maqueta `robledo-graficadora/` para conectar los métodos con la graficadora interactiva.

```
metodos-numericos/
├── biseccion.js
├── regula-falsi.js
├── newton.js
├── secante.js
└── punto-fijo.js
```

---

## Maquetas de funcionalidad en prueba

Las siguientes maquetas incorporan librerías de terceros que se están evaluando. Si el equipo las aprueba, se integrarán al software principal en un sprint posterior.

### Teclado matemático
Prueba de teclado virtual matemático para reemplazar el input de texto plano en la entrada de funciones.

**Librería:** [MathLive](https://mathlive.io/) — entrada con soporte LaTeX y teclado virtual táctil.

🫚 https://imsaee.github.io/AN.NUM---FRONTEND/test/roble-teclado-test.html 🫚

### Graficadora interactiva
Propuesta personal de Robledo — no es una tarea asignada, sino una iniciativa propia. La maqueta no tiene estilos de forma intencional: el objetivo fue demostrar que la funcionalidad opera correctamente antes de invertir tiempo en diseño. El estilo es responsabilidad de Sae y Scrivanely; si la propuesta les convence, pueden usarla como referencia o copiarla directamente y darle el aspecto que consideren.

**Esta maqueta no se instala en el software principal hasta recibir aprobación del equipo frontend (Sae, Scrivanely).**

El HTML actúa como un visualizador sin lógica propia: selecciona el método, lee los parámetros, invoca la función del método correspondiente y muestra el resultado. La gráfica permite zoom y pan.

**Librería:** [JSXGraph](https://jsxgraph.org/) — graficadora interactiva con zoom (rueda del mouse / pinch) y pan (arrastrar), compatible con móvil.

> **Nota sobre el uso de software de terceros:** A diferencia del teclado matemático (que es una comodidad de interfaz sin relación directa con la materia), la graficadora sí se vincula con los contenidos de Análisis Numérico. Queda a criterio del equipo y del docente si el uso de JSXGraph es apropiado en este contexto. Vale mencionar que el software principal ya utiliza librerías de terceros (math.js, Chart.js), por lo que no sería el primer caso.
>
> La analogía es la siguiente: si alguien construye una casa sin fabricar los ladrillos, ¿construyó la casa? Sí — el trabajo es la construcción, no la fabricación del material. De la misma forma, usar JSXGraph para visualizar no reemplaza el trabajo de implementar los métodos numéricos; los algoritmos (bisección, Newton-Raphson, etc.) son la casa. La librería es el ladrillo.

🫚 https://imsaee.github.io/AN.NUM---FRONTEND/robledo-graficadora/index.html 🫚

---

## Próximo sprint

**Responsable:** Sae (frontend)

- Mejorar el estilo del software principal
- Integrar las funcionalidades de las maquetas una vez revisadas y aprobadas por el equipo completo (Sae, Scrivanely)

🐷 Se esperan correcciones y propuestas del equipo de desarrollo sobre las maquetas antes de integrarlas. 🐷

---

## Estructura del proyecto

```
.
├── index.html                  — software principal
├── script.js
├── style.css
├── README.md
├── docs/
│   └── CHANGELOG.md            — historial de cambios
├── metodos-numericos/          — lógica pura, un archivo por método
│   ├── biseccion.js
│   ├── regula-falsi.js
│   ├── newton.js
│   ├── secante.js
│   └── punto-fijo.js
├── robledo-graficadora/        — maqueta graficadora interactiva
│   ├── index.html
│   ├── script.js
│   ├── consola.js              — consola de diagnóstico con historial
│   └── style.css
└── test/                       — maquetas de prueba
    ├── audioaldeano/           — sonidos para teclado matemático
    │   ├── 0.mp3
    │   ├── 1.mp3
    │   ├── 2.mp3
    │   ├── 3.mp3
    │   ├── 4.mp3
    │   ├── 5.mp3
    │   ├── 6.mp3
    │   └── 7.mp3
    ├── roble-teclado-test.html
    ├── roble-teclado-test.css
    └── roble-teclado-test.js
```
