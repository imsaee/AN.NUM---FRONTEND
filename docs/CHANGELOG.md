# CHANGELOG

---

## `823c2f5` — 2026-05-31

### robledo-graficadora: consola de diagnóstico

**Archivos modificados:**
- `robledo-graficadora/consola.js` — archivo nuevo
- `robledo-graficadora/index.html` — agrega `<script src="consola.js">` antes de `script.js`
- `README.md` — sección bitácora de cambios con tabla y enlace a docs/
- `docs/CHANGELOG.md` — archivo nuevo (este documento)

**Qué hace:**
Se agrega una consola de diagnóstico visible en la página de la graficadora. La consola aparece como un `<pre>` al final del body, sin CSS, y acumula un historial de todas las operaciones ejecutadas durante la sesión.

Cada entrada registra:
- Timestamp (`HH:MM:SS`)
- Método numérico seleccionado
- Resultado: raíz, iteraciones, error final — o mensaje de error si falló

**Cómo funciona `consola.js`:**
- Se inyecta de forma autónoma (no modifica `script.js`)
- Sobrescribe `console.log`, `console.warn` y `console.error` para mostrar mensajes en pantalla
- Captura `window.onerror` y `window.onunhandledrejection` para errores globales no atrapados
- Usa un `MutationObserver` sobre `#res-raiz` para detectar cuando `script.js` actualiza el resultado y registrarlo en la consola

**Por qué se hizo así:**
La consola del software principal (`#txt-res`) reemplaza el contenido en cada operación. Esta implementación opta por acumular para que el desarrollador pueda comparar múltiples corridas sin perder el historial.

---

## Convención

Este changelog cubre únicamente los cambios de Robledo en `robledo-graficadora/`.  
El software principal (`index.html`, `script.js`, `style.css`) no ha sido modificado.
