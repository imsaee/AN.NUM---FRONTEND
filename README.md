# AN.NUM — Frontend

Herramienta de análisis numérico con graficadora interactiva.

**Deploy:** https://imsaee.github.io/AN.NUM---FRONTEND/

---

## Software principal

Calculadora de métodos numéricos para búsqueda de raíces, desarrollada por Wilson. Permite ingresar una función f(x), elegir un método y visualizar el resultado en una gráfica.

**Métodos disponibles:** Bisección, Regula Falsi, Newton-Raphson, Secante, Punto Fijo.

**Software de terceros:**
- [math.js](https://mathjs.org/) — evaluación y derivación simbólica de funciones
- [Chart.js](https://www.chartjs.org/) — gráfica de la función y marcado de la raíz

---

## Refactor de arquitectura

Los métodos numéricos que Wilson desarrolló en `script.js` fueron separados en archivos individuales dentro de la carpeta `metodos-numericos/`, un archivo por método. El objetivo es que cada archivo contenga únicamente la lógica matemática, sin ninguna referencia al DOM ni a la interfaz. De esta forma el HTML actúa como un visualizador simple que no piensa — solo llama al método, recibe el resultado y lo muestra.

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

https://imsaee.github.io/AN.NUM---FRONTEND/test/roble-teclado-test.html

### Graficadora interactiva
Maqueta de graficadora con los métodos numéricos conectados. El HTML es un visualizador sin lógica propia: selecciona el método, lee los parámetros, invoca la función del método correspondiente y muestra el resultado. La gráfica permite zoom y pan.

**Librería:** [JSXGraph](https://jsxgraph.org/) — graficadora interactiva con zoom (rueda del mouse / pinch) y pan (arrastrar), compatible con móvil.

https://imsaee.github.io/AN.NUM---FRONTEND/robledo-graficadora/index.html

---

## Próximo sprint

**Responsable:** Sae (frontend)

- Mejorar el estilo del software principal
- Integrar las funcionalidades de las maquetas una vez revisadas y aprobadas por el equipo completo (Sae, Scrivanely)

Se esperan correcciones y propuestas del equipo de desarrollo sobre las maquetas antes de integrarlas.

---

## Estructura del proyecto

```
/
├── index.html                  — software principal
├── script.js
├── style.css
├── metodos-numericos/          — lógica pura, un archivo por método
│   ├── biseccion.js
│   ├── regula-falsi.js
│   ├── newton.js
│   ├── secante.js
│   └── punto-fijo.js
├── robledo-graficadora/        — maqueta graficadora interactiva
│   ├── index.html
│   ├── script.js
│   └── style.css
└── test/                       — maquetas de prueba
    └── roble-teclado-test.html
```
