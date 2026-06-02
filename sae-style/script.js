// ── PANEL SWITCHING ──────────────────────────────────────────────────────────
const todosLosPaneles = [
    'biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo',
    'trapezoidal-simple', 'trapezoidal-comp', 'simpson13',
    'euler', 'rk4',
    'jacobi', 'gauss-seidel', 'gauss-simple', 'gauss-jordan'
];

function actualizarParametros() {
    const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked').value;
    
    todosLosPaneles.forEach(panelId => {
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

function actualizarEstiloBotones() {
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const radioSeleccionado = document.querySelector('input[name="metodo"]:checked');
    if (radioSeleccionado) {
        radioSeleccionado.closest('.method-btn').classList.add('active');
    }
}

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

// ── FUNCIÓN PARA FORMATEAR RESULTADO ─────────────────────────────────────────
function formatearResultado(valor) {
    if (typeof valor === 'number') return valor.toFixed(6);
    if (Array.isArray(valor)) return `[${valor.map(v => v.toFixed(6)).join(', ')}]`;
    return String(valor);
}

// ── ALMACENAMIENTO DE RESULTADOS ───────────────────────────────────────────
let resultadosGuardados = {};

function guardarResultadoEnTabla(metodo, resultado, iteraciones, error, exito) {
    const nombresMetodos = {
        'biseccion': 'Bisección',
        'regula-falsi': 'Regula Falsi',
        'newton': 'Newton-Raphson',
        'secante': 'Secante',
        'punto-fijo': 'Punto Fijo',
        'trapezoidal-simple': 'Trapezoidal Simple',
        'trapezoidal-comp': 'Trapezoidal Compuesta',
        'simpson13': 'Simpson 1/3',
        'euler': 'Euler',
        'rk4': 'Runge-Kutta 4',
        'jacobi': 'Jacobi',
        'gauss-seidel': 'Gauss-Seidel',
        'gauss-simple': 'Gauss Simple',
        'gauss-jordan': 'Gauss-Jordan'
    };
    
    resultadosGuardados[metodo] = {
        nombre: nombresMetodos[metodo],
        resultado: formatearResultado(resultado),
        iteraciones: iteraciones || '---',
        error: error ? (typeof error === 'number' ? error.toExponential(4) : error) : '---',
        exito: exito,
        valorNum: typeof resultado === 'number' ? resultado : null,
        errorNum: typeof error === 'number' ? error : Infinity
    };
    
    actualizarTablaSinMejor();
}

function actualizarTablaSinMejor() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    // Limpiar y regenerar tabla
    tbody.innerHTML = '';
    
    for (const [metodo, res] of Object.entries(resultadosGuardados)) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = res.nombre;
        row.insertCell(1).textContent = res.resultado;
        row.insertCell(2).textContent = res.iteraciones;
        row.insertCell(3).textContent = res.error;
        row.insertCell(4).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
        row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
    }
    
    document.getElementById('best-method-section').style.display = 'none';
}

function mostrarComparacion() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;
    
    let mejorMetodo = null;
    let menorError = Infinity;
    
    for (const [metodo, res] of Object.entries(resultadosGuardados)) {
        if (res.exito && typeof res.errorNum === 'number' && res.errorNum < menorError && res.errorNum !== Infinity) {
            menorError = res.errorNum;
            mejorMetodo = metodo;
        }
    }
    
    // Reconstruir tabla con resaltado
    tbody.innerHTML = '';
    
    for (const [metodo, res] of Object.entries(resultadosGuardados)) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = res.nombre;
        row.insertCell(1).textContent = res.resultado;
        row.insertCell(2).textContent = res.iteraciones;
        row.insertCell(3).textContent = res.error;
        row.insertCell(4).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
        row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
        
        if (mejorMetodo === metodo) {
            row.classList.add('best-result');
        }
    }
    
    const bestSection = document.getElementById('best-method-section');
    const bestName = document.getElementById('best-method-name');
    const bestDetails = document.getElementById('best-method-details');
    
    if (mejorMetodo && menorError !== Infinity) {
        const mejor = resultadosGuardados[mejorMetodo];
        bestSection.style.display = 'block';
        bestName.textContent = mejor.nombre;
        bestDetails.innerHTML = `Error: ${menorError.toExponential(4)} | Iteraciones: ${mejor.iteraciones} | Resultado: ${mejor.resultado}`;
    } else {
        bestSection.style.display = 'none';
    }
}

function limpiarComparacion() {
    resultadosGuardados = {};
    const tbody = document.getElementById('comparison-body');
    if (tbody) {
        tbody.innerHTML = '';
    }
    document.getElementById('best-method-section').style.display = 'none';
    document.getElementById('res-raiz').textContent = '---';
    document.getElementById('res-iter').textContent = '---';
    document.getElementById('res-error').textContent = '---';
}

// ── PARSER PARA SISTEMAS LINEALES ───────────────────────────────────────────
function parseMatrix(str) {
    return str.split(';').map(row => row.split(',').map(Number));
}

function parseVector(str) {
    return str.split(';').map(Number);
}

// ── CALCULAR ────────────────────────────────────────────────────────────────
document.getElementById('btn-calcular').addEventListener('click', () => {
    const metodo = document.querySelector('input[name="metodo"]:checked').value;
    const maxIter = 100;

    try {
        let resultado = null;
        let iteraciones = 0;
        let errorFinal = 0;
        let funcStr = document.getElementById('func').value;
        const f = x => math.evaluate(funcStr, { x });

        // ── MÉTODOS DE RAÍCES ────────────────────────────────────────────────
        if (metodo === 'biseccion') {
            resultado = metodoBiseccion(f, 
                parseFloat(document.getElementById('bis-a').value),
                parseFloat(document.getElementById('bis-b').value),
                parseFloat(document.getElementById('bis-tol').value), maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            
        } else if (metodo === 'regula-falsi') {
            resultado = metodoRegulaFalsi(f,
                parseFloat(document.getElementById('rf-a').value),
                parseFloat(document.getElementById('rf-b').value),
                parseFloat(document.getElementById('rf-tol').value), maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            
        } else if (metodo === 'newton') {
            const df = x => math.derivative(funcStr, 'x').evaluate({ x });
            resultado = metodoNewton(f, df,
                parseFloat(document.getElementById('nr-x0').value),
                parseFloat(document.getElementById('nr-tol').value), maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            
        } else if (metodo === 'secante') {
            resultado = metodoSecante(f,
                parseFloat(document.getElementById('sc-x0').value),
                parseFloat(document.getElementById('sc-x1').value),
                parseFloat(document.getElementById('sc-tol').value), maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            
        } else if (metodo === 'punto-fijo') {
            resultado = metodoPuntoFijo(f,
                parseFloat(document.getElementById('pf-x0').value),
                parseFloat(document.getElementById('pf-tol').value), maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            
        // ── MÉTODOS DE INTEGRACIÓN ───────────────────────────────────────────
        } else if (metodo === 'trapezoidal-simple') {
            const a = parseFloat(document.getElementById('trap-simple-a').value);
            const b = parseFloat(document.getElementById('trap-simple-b').value);
            resultado = reglaTrapezoidalSimple(a, b, f);
            iteraciones = resultado.pasos.length;
            errorFinal = 0;
            
        } else if (metodo === 'trapezoidal-comp') {
            const a = parseFloat(document.getElementById('trap-comp-a').value);
            const b = parseFloat(document.getElementById('trap-comp-b').value);
            const n = parseInt(document.getElementById('trap-comp-n').value);
            resultado = reglaTrapezoidalComp(a, b, n, f);
            iteraciones = n;
            errorFinal = 0;
            
        } else if (metodo === 'simpson13') {
            const a = parseFloat(document.getElementById('simp-a').value);
            const b = parseFloat(document.getElementById('simp-b').value);
            resultado = reglaSimpson13Simple(a, b, f);
            iteraciones = resultado.pasos.length;
            errorFinal = 0;
            
        // ── MÉTODOS DE EDO ───────────────────────────────────────────────────
        } else if (metodo === 'euler') {
            const xi = parseFloat(document.getElementById('euler-xi').value);
            const yi = parseFloat(document.getElementById('euler-yi').value);
            const xf = parseFloat(document.getElementById('euler-xf').value);
            const dx = parseFloat(document.getElementById('euler-dx').value);
            const derivsStr = document.getElementById('euler-derivs').value;
            const derivs = (x, y) => math.evaluate(derivsStr, { x, y });
            resultado = metodoEulerModular(xi, yi, xf, dx, 0.1, derivs);
            iteraciones = resultado.pasos.length;
            errorFinal = 0;
            
        } else if (metodo === 'rk4') {
            const xi = parseFloat(document.getElementById('rk4-xi').value);
            const yi = parseFloat(document.getElementById('rk4-yi').value);
            const xf = parseFloat(document.getElementById('rk4-xf').value);
            const dx = parseFloat(document.getElementById('rk4-dx').value);
            const derivsStr = document.getElementById('rk4-derivs').value;
            const derivs = (x, y) => {
                if (Array.isArray(y)) {
                    return [math.evaluate(derivsStr, { x, y: y[0] })];
                }
                return math.evaluate(derivsStr, { x, y });
            };
            resultado = metodoRK4Modular(xi, [yi], xf, dx, 0.1, derivs);
            iteraciones = resultado.pasos.length;
            errorFinal = 0;
            
        // ── MÉTODOS DE SISTEMAS LINEALES ─────────────────────────────────────
        } else if (metodo === 'jacobi') {
            const A = parseMatrix(document.getElementById('jacobi-A').value);
            const b = parseVector(document.getElementById('jacobi-b').value);
            const x0 = parseVector(document.getElementById('jacobi-x0').value);
            const tol = parseFloat(document.getElementById('jacobi-tol').value);
            resultado = metodoJacobi(A, b, x0, tol, maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1]?.error || 0;
            
        } else if (metodo === 'gauss-seidel') {
            const A = parseMatrix(document.getElementById('gs-A').value);
            const b = parseVector(document.getElementById('gs-b').value);
            const x0 = parseVector(document.getElementById('gs-x0').value);
            const tol = parseFloat(document.getElementById('gs-tol').value);
            resultado = metodoGaussSeidel(A, b, x0, tol, maxIter);
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1]?.error || 0;
            
        } else if (metodo === 'gauss-simple') {
            const A = parseMatrix(document.getElementById('gauss-A').value);
            const b = parseVector(document.getElementById('gauss-b').value);
            resultado = metodoGaussSimple(A, b);
            iteraciones = resultado.pasos?.length || 1;
            errorFinal = 0;
            
        } else if (metodo === 'gauss-jordan') {
            const A = parseMatrix(document.getElementById('gj-A').value);
            const b = parseVector(document.getElementById('gj-b').value);
            resultado = metodoGaussJordan(A, b);
            iteraciones = 1;
            errorFinal = 0;
        }

        // Extraer el valor a mostrar
        let valorMostrar;
        if (resultado.raiz !== undefined) valorMostrar = resultado.raiz;
        else if (resultado.solucion !== undefined) valorMostrar = resultado.solucion;
        else if (resultado.resultado !== undefined) valorMostrar = resultado.resultado;
        else valorMostrar = resultado;

        document.getElementById('res-raiz').textContent = formatearResultado(valorMostrar);
        document.getElementById('res-iter').textContent = iteraciones;
        document.getElementById('res-error').textContent = typeof errorFinal === 'number' ? errorFinal.toExponential(4) : '---';

        guardarResultadoEnTabla(metodo, valorMostrar, iteraciones, errorFinal, true);

        // Actualizar gráfica solo para funciones que devuelven un número
        if (typeof valorMostrar === 'number' && metodo !== 'trapezoidal-simple' && metodo !== 'trapezoidal-comp' && metodo !== 'simpson13') {
            if (curva) board.removeObject(curva);
            if (puntoRaiz) board.removeObject(puntoRaiz);
            
            curva = board.create('functiongraph', [x => math.evaluate(funcStr, { x })], {
                strokeColor: '#197278', strokeWidth: 2
            });
            puntoRaiz = board.create('point', [valorMostrar, 0], {
                name: `x = ${valorMostrar.toFixed(4)}`, color: '#c44536', size: 4, fixed: true
            });
        }

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