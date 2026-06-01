// ── PANEL SWITCHING ──────────────────────────────────────────────────────────
function actualizarParametros() {
    const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked').value;
    const paneles = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    paneles.forEach(panelId => {
        const panel = document.getElementById(`params-${panelId}`);
        if (panel) {
            if (panelId === metodoSeleccionado) {
                panel.style.display = 'flex';
            } else {
                panel.style.display = 'none';
            }
        }
    });
}

// Cambiar estilo visual del botón activo
function actualizarEstiloBotones() {
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const radioSeleccionado = document.querySelector('input[name="metodo"]:checked');
    if (radioSeleccionado) {
        radioSeleccionado.closest('.method-btn').classList.add('active');
    }
}

// Inicializar eventos de los radios
document.querySelectorAll('input[name="metodo"]').forEach(radio => {
    radio.addEventListener('change', () => {
        actualizarParametros();
        actualizarEstiloBotones();
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

let curva = null;
let puntoRaiz = null;

// ── ALMACENAMIENTO DE RESULTADOS ───────────────────────────────────────────
let resultadosGuardados = {};

// ── GUARDAR RESULTADO ────────────────────────────────────────────────────────
function guardarResultadoEnTabla(metodo, raiz, iteraciones, error, exito) {
    const nombresMetodos = {
        'biseccion': 'Bisección',
        'regula-falsi': 'Regula Falsi',
        'newton': 'Newton-Raphson',
        'secante': 'Secante',
        'punto-fijo': 'Punto Fijo'
    };
    
    resultadosGuardados[metodo] = {
        nombre: nombresMetodos[metodo],
        raiz: exito ? raiz.toFixed(6) : 'ERROR',
        iteraciones: exito ? iteraciones : '---',
        error: exito ? error.toExponential(4) : error,
        exito: exito,
        errorNum: exito ? error : Infinity
    };
    
    actualizarTablaSinMejor();
}

function actualizarTablaSinMejor() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    const orden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    orden.forEach((metodo, i) => {
        const res = resultadosGuardados[metodo];
        const row = tbody.children[i];
        if (row && res) {
            row.cells[1].textContent = res.raiz;
            row.cells[2].textContent = res.iteraciones;
            row.cells[3].textContent = res.error;
            row.cells[4].innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
            row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
            row.classList.remove('best-result');
        }
    });
    
    document.getElementById('best-method-section').style.display = 'none';
}

function mostrarComparacion() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    const orden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    let mejorMetodo = null;
    let menorError = Infinity;
    
    for (const [metodo, res] of Object.entries(resultadosGuardados)) {
        if (res.exito && res.errorNum < menorError) {
            menorError = res.errorNum;
            mejorMetodo = metodo;
        }
    }
    
    orden.forEach((metodo, i) => {
        const res = resultadosGuardados[metodo];
        const row = tbody.children[i];
        if (row && res) {
            row.cells[1].textContent = res.raiz;
            row.cells[2].textContent = res.iteraciones;
            row.cells[3].textContent = res.error;
            row.cells[4].innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
            row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
            
            if (mejorMetodo === metodo) {
                row.classList.add('best-result');
            } else {
                row.classList.remove('best-result');
            }
        }
    });
    
    const bestSection = document.getElementById('best-method-section');
    const bestName = document.getElementById('best-method-name');
    const bestDetails = document.getElementById('best-method-details');
    
    if (mejorMetodo && menorError !== Infinity) {
        const mejor = resultadosGuardados[mejorMetodo];
        bestSection.style.display = 'block';
        bestName.textContent = mejor.nombre;
        bestDetails.innerHTML = `Error: ${menorError.toExponential(4)} | Iteraciones: ${mejor.iteraciones} | Raíz: ${mejor.raiz}`;
    }
}

function limpiarComparacion() {
    resultadosGuardados = {};
    const tbody = document.getElementById('comparison-body');
    if (tbody) {
        for (let i = 0; i < tbody.children.length; i++) {
            const row = tbody.children[i];
            row.cells[1].textContent = '---';
            row.cells[2].textContent = '---';
            row.cells[3].textContent = '---';
            row.cells[4].innerHTML = '⏳ Pendiente';
            row.cells[4].style.color = '#ffc107';
            row.classList.remove('best-result');
        }
    }
    document.getElementById('best-method-section').style.display = 'none';
    document.getElementById('res-raiz').textContent = '---';
    document.getElementById('res-iter').textContent = '---';
    document.getElementById('res-error').textContent = '---';
}

// ── CALCULAR ────────────────────────────────────────────────────────────────
document.getElementById('btn-calcular').addEventListener('click', () => {
    const metodo = document.querySelector('input[name="metodo"]:checked').value;
    const maxIter = 100;

    try {
        let resultado, funcStr = document.getElementById('func').value;
        const f = x => math.evaluate(funcStr, { x });

        if (metodo === 'biseccion') {
            resultado = metodoBiseccion(f, 
                parseFloat(document.getElementById('bis-a').value),
                parseFloat(document.getElementById('bis-b').value),
                parseFloat(document.getElementById('bis-tol').value), maxIter);
        } else if (metodo === 'regula-falsi') {
            resultado = metodoRegulaFalsi(f,
                parseFloat(document.getElementById('rf-a').value),
                parseFloat(document.getElementById('rf-b').value),
                parseFloat(document.getElementById('rf-tol').value), maxIter);
        } else if (metodo === 'newton') {
            const df = x => math.derivative(funcStr, 'x').evaluate({ x });
            resultado = metodoNewton(f, df,
                parseFloat(document.getElementById('nr-x0').value),
                parseFloat(document.getElementById('nr-tol').value), maxIter);
        } else if (metodo === 'secante') {
            resultado = metodoSecante(f,
                parseFloat(document.getElementById('sc-x0').value),
                parseFloat(document.getElementById('sc-x1').value),
                parseFloat(document.getElementById('sc-tol').value), maxIter);
        } else if (metodo === 'punto-fijo') {
            resultado = metodoPuntoFijo(f,
                parseFloat(document.getElementById('pf-x0').value),
                parseFloat(document.getElementById('pf-tol').value), maxIter);
        }

        const { raiz, pasos } = resultado;
        const errorFinal = pasos[pasos.length - 1].error;

        document.getElementById('res-raiz').textContent = raiz.toFixed(6);
        document.getElementById('res-iter').textContent = pasos.length;
        document.getElementById('res-error').textContent = errorFinal.toExponential(4);

        guardarResultadoEnTabla(metodo, raiz, pasos.length, errorFinal, true);

        if (curva) board.removeObject(curva);
        if (puntoRaiz) board.removeObject(puntoRaiz);

        curva = board.create('functiongraph', [x => math.evaluate(funcStr, { x })], {
            strokeColor: '#197278', strokeWidth: 2
        });
        puntoRaiz = board.create('point', [raiz, 0], {
            name: `x = ${raiz.toFixed(4)}`, color: '#c44536', size: 4, fixed: true
        });

    } catch (e) {
        document.getElementById('res-raiz').textContent = 'ERROR';
        document.getElementById('res-error').textContent = e.message;
        guardarResultadoEnTabla(metodo, null, null, e.message, false);
    }
});

// ── BOTONES DE COMPARACIÓN ──────────────────────────────────────────────────
document.getElementById('compare-all').addEventListener('click', () => {
    if (Object.keys(resultadosGuardados).length === 0) {
        alert('⚠️ No hay resultados. Calcula al menos un método.');
        return;
    }
    mostrarComparacion();
});

document.getElementById('clear-comparison').addEventListener('click', limpiarComparacion);

// ── INICIALIZAR ────────────────────────────────────────────────────────────
actualizarParametros();
actualizarEstiloBotones();