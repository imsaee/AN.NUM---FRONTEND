// ── PANEL SWITCHING ──────────────────────────────────────────────────────────
const paneles = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];

document.querySelectorAll('input[name="metodo"]').forEach(radio => {
    radio.addEventListener('change', () => {
        paneles.forEach(id => {
            document.getElementById(`params-${id}`).hidden = (id !== radio.value);
        });
    });
});

// ── JSXGRAPH ─────────────────────────────────────────────────────────────────
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-5, 10, 5, -10],
    axis: true,
    showCopyright: false,
    zoom: { enabled: true, wheel: true, needShift: false },
    pan:  { enabled: true, needShift: false, needTwoFingers: false },
});

let curva     = null;
let puntoRaiz = null;

// ── ALMACENAMIENTO DE RESULTADOS ───────────────────────────────────────────
let resultadosGuardados = {};

// ── GUARDAR RESULTADO (SOLO GUARDA, NO MUESTRA EL MEJOR) ────────────────────
function guardarResultadoEnTabla(metodo, raiz, iteraciones, error, exito) {
    const nombresMetodos = {
        'biseccion': 'Bisección',
        'regula-falsi': 'Regula Falsi',
        'newton': 'Newton-Raphson',
        'secante': 'Secante',
        'punto-fijo': 'Punto Fijo'
    };
    
    const nombreMostrar = nombresMetodos[metodo] || metodo;
    
    resultadosGuardados[metodo] = {
        nombre: nombreMostrar,
        raiz: exito ? raiz.toFixed(6) : 'ERROR',
        iteraciones: exito ? iteraciones : '---',
        error: exito ? error.toExponential(4) : (error || 'Error'),
        exito: exito,
        raizNum: exito ? raiz : null,
        errorNum: exito ? error : Infinity
    };
    
    // Solo actualizar la tabla, NO mostrar el mejor método automáticamente
    actualizarTablaVisualSinMejor();
}

// ── ACTUALIZAR TABLA SIN MOSTRAR MEJOR MÉTODO ───────────────────────────────
function actualizarTablaVisualSinMejor() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    const metodosOrden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    // Actualizar cada fila de la tabla (sin resaltar mejor método)
    metodosOrden.forEach((metodo, index) => {
        const res = resultadosGuardados[metodo];
        const row = tbody.children[index];
        if (row && res) {
            row.cells[1].textContent = res.raiz;
            row.cells[2].textContent = res.iteraciones;
            row.cells[3].textContent = res.error;
            row.cells[4].innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
            row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
            row.classList.remove('best-result'); // Quitar cualquier resaltado
        } else if (row && !res) {
            row.cells[1].textContent = '---';
            row.cells[2].textContent = '---';
            row.cells[3].textContent = '---';
            row.cells[4].innerHTML = '⏳ Pendiente';
            row.cells[4].style.color = '#ffc107';
            row.classList.remove('best-result');
        }
    });
    
    // Ocultar la tarjeta del mejor método
    const bestSection = document.getElementById('best-method-section');
    if (bestSection) {
        bestSection.style.display = 'none';
    }
}

// ── ACTUALIZAR TABLA Y MOSTRAR MEJOR MÉTODO (SOLO AL COMPARAR) ──────────────
function mostrarComparacionConMejor() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    const metodosOrden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    // Encontrar mejor resultado (menor error)
    let mejorMetodo = null;
    let menorError = Infinity;
    
    for (const [metodo, res] of Object.entries(resultadosGuardados)) {
        if (res.exito && res.errorNum < menorError) {
            menorError = res.errorNum;
            mejorMetodo = metodo;
        }
    }
    
    // Actualizar cada fila de la tabla con resaltado
    metodosOrden.forEach((metodo, index) => {
        const res = resultadosGuardados[metodo];
        const row = tbody.children[index];
        if (row && res) {
            row.cells[1].textContent = res.raiz;
            row.cells[2].textContent = res.iteraciones;
            row.cells[3].textContent = res.error;
            row.cells[4].innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
            row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
            
            // Resaltar el mejor método en la tabla
            if (mejorMetodo === metodo) {
                row.classList.add('best-result');
            } else {
                row.classList.remove('best-result');
            }
        } else if (row && !res) {
            row.cells[1].textContent = '---';
            row.cells[2].textContent = '---';
            row.cells[3].textContent = '---';
            row.cells[4].innerHTML = '⏳ Pendiente';
            row.cells[4].style.color = '#ffc107';
            row.classList.remove('best-result');
        }
    });
    
    // Mostrar tarjeta del mejor método si existe al menos un resultado exitoso
    const bestSection = document.getElementById('best-method-section');
    const bestName = document.getElementById('best-method-name');
    const bestDetails = document.getElementById('best-method-details');
    
    if (mejorMetodo && menorError !== Infinity) {
        const mejorRes = resultadosGuardados[mejorMetodo];
        bestSection.style.display = 'block';
        bestName.textContent = mejorRes.nombre;
        bestDetails.innerHTML = `Error: ${menorError.toExponential(4)} | Iteraciones: ${mejorRes.iteraciones} | Raíz: ${mejorRes.raiz}`;
    } else {
        bestSection.style.display = 'none';
    }
}

// ── LIMPIAR TODO ────────────────────────────────────────────────────────────
function limpiarTablaComparacion() {
    resultadosGuardados = {};
    
    const tbody = document.getElementById('comparison-body');
    if (tbody) {
        const metodosOrden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
        metodosOrden.forEach((_, index) => {
            const row = tbody.children[index];
            if (row) {
                row.cells[1].textContent = '---';
                row.cells[2].textContent = '---';
                row.cells[3].textContent = '---';
                row.cells[4].innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
                row.classList.remove('best-result');
            }
        });
    }
    
    // Ocultar tarjeta del mejor método
    const bestSection = document.getElementById('best-method-section');
    if (bestSection) {
        bestSection.style.display = 'none';
    }
    
    // Limpiar resultado actual
    document.getElementById('res-raiz').textContent = '---';
    document.getElementById('res-iter').textContent = '---';
    document.getElementById('res-error').textContent = '---';
}

// ── CALCULAR ────────────────────────────────────────────────────────────────
document.getElementById('btn-calcular').addEventListener('click', () => {
    const metodo  = document.querySelector('input[name="metodo"]:checked').value;
    const maxIter = 100;

    try {
        let resultado, funcStr;

        if (metodo === 'biseccion') {
            funcStr      = document.getElementById('func').value;
            const a      = parseFloat(document.getElementById('bis-a').value);
            const b      = parseFloat(document.getElementById('bis-b').value);
            const tol    = parseFloat(document.getElementById('bis-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoBiseccion(f, a, b, tol, maxIter);

        } else if (metodo === 'regula-falsi') {
            funcStr      = document.getElementById('func').value;
            const a      = parseFloat(document.getElementById('rf-a').value);
            const b      = parseFloat(document.getElementById('rf-b').value);
            const tol    = parseFloat(document.getElementById('rf-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoRegulaFalsi(f, a, b, tol, maxIter);

        } else if (metodo === 'newton') {
            funcStr      = document.getElementById('func').value;
            const x0     = parseFloat(document.getElementById('nr-x0').value);
            const tol    = parseFloat(document.getElementById('nr-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            const df     = x => math.derivative(funcStr, 'x').evaluate({ x });
            resultado    = metodoNewton(f, df, x0, tol, maxIter);

        } else if (metodo === 'secante') {
            funcStr      = document.getElementById('func').value;
            const x0     = parseFloat(document.getElementById('sc-x0').value);
            const x1     = parseFloat(document.getElementById('sc-x1').value);
            const tol    = parseFloat(document.getElementById('sc-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoSecante(f, x0, x1, tol, maxIter);

        } else if (metodo === 'punto-fijo') {
            funcStr      = document.getElementById('func').value;
            const x0     = parseFloat(document.getElementById('pf-x0').value);
            const tol    = parseFloat(document.getElementById('pf-tol').value);
            const g      = x => math.evaluate(funcStr, { x });
            resultado    = metodoPuntoFijo(g, x0, tol, maxIter);
        }

        const { raiz, pasos } = resultado;
        const errorFinal = pasos[pasos.length - 1].error;

        // Mostrar resultado actual
        document.getElementById('res-raiz').textContent  = raiz.toFixed(6);
        document.getElementById('res-iter').textContent  = pasos.length;
        document.getElementById('res-error').textContent = errorFinal.toExponential(4);

        // Guardar en tabla comparativa (SIN mostrar el mejor método automáticamente)
        guardarResultadoEnTabla(metodo, raiz, pasos.length, errorFinal, true);

        // Actualizar gráfica
        if (curva)     board.removeObject(curva);
        if (puntoRaiz) board.removeObject(puntoRaiz);

        curva = board.create('functiongraph', [x => math.evaluate(funcStr, { x })], {
            strokeColor: '#6B8E23',
            strokeWidth: 2,
        });

        puntoRaiz = board.create('point', [raiz, 0], {
            name: `x = ${raiz.toFixed(4)}`,
            color: '#D35400',
            size: 4,
            fixed: true,
        });

    } catch (e) {
        document.getElementById('res-raiz').textContent  = 'ERROR';
        document.getElementById('res-iter').textContent  = '---';
        document.getElementById('res-error').textContent = e.message;
        
        guardarResultadoEnTabla(metodo, null, null, e.message, false);
    }
});

// ── BOTÓN COMPARAR (SOLO AQUÍ SE MUESTRA EL MEJOR MÉTODO) ────────────────────
document.getElementById('compare-all').addEventListener('click', () => {
    const metodosExistentes = Object.keys(resultadosGuardados);
    
    if (metodosExistentes.length === 0) {
        alert('⚠️ No hay resultados para comparar. Calcula al menos un método primero.');
        return;
    }
    
    // MOSTRAR la comparación CON el mejor método resaltado y la tarjeta dorada
    mostrarComparacionConMejor();
});

// ── BOTÓN LIMPIAR ───────────────────────────────────────────────────────────
document.getElementById('clear-comparison').addEventListener('click', () => {
    limpiarTablaComparacion();
});