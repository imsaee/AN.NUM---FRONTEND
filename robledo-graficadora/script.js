// ── PANEL SWITCHING ──────────────────────────────────────────────────────────
const panelesRaices = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo', 'regla-trapezoidal', 'regla-trapezoidal-simple', 'simpson1-3', 'simpson38', 'euler-modular', 'rk4-modular'];
const panelesMatriciales = ['gauss-simple', 'gauss-jordan', 'jacobi', 'gauss-seidel'];
const paneles = [...panelesRaices, ...panelesMatriciales];

// Generador dinámico de inputs para la Matriz
function dibujarMatriz(n) {
    const container = document.getElementById('matriz-inputs-container');
    let html = '<table style="margin-bottom: 15px;">';
    for (let i = 0; i < n; i++) {
        html += '<tr>';
        for (let j = 0; j < n; j++) {
            let valDefecto = (i === j) ? 2 : 0; // Coloca un 2 en la diagonal por defecto
            html += `<td><input type="number" id="A_${i}_${j}" value="${valDefecto}" style="width:55px;" step="any"> X<sub>${j+1}</sub></td>`;
        }
        html += `<td> = <input type="number" id="b_${i}" value="1" style="width:55px;" step="any"></td>`;
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
}

// Escuchar cambios en el tamaño N de la matriz
document.getElementById('mat-n').addEventListener('input', (e) => {
    let n = parseInt(e.target.value) || 3;
    if (n < 2) n = 2; if (n > 6) n = 6;
    dibujarMatriz(n);
});
dibujarMatriz(3); // Inicialización por defecto en 3x3

document.querySelectorAll('input[name="metodo"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const metodoActual = radio.value;
        const esMatricial = panelesMatriciales.includes(metodoActual);
        const esIterativoMat = (metodoActual === 'jacobi' || metodoActual === 'gauss-seidel');

        // El input f(x) solo vive en métodos de raíces
        const inputFunc = document.getElementById('func');
        if (inputFunc && inputFunc.parentElement) {
            inputFunc.parentElement.hidden = esMatricial;
        }

        // Controlar visibilidad del contenedor de JSXGraph según el método
        if (metodoActual === 'gauss-simple' || metodoActual === 'gauss-jordan') {
            document.getElementById('jxgbox').style.display = 'none';
        } else {
            document.getElementById('jxgbox').style.display = 'block';
            // Forzar a JSXGraph a redibujarse correctamente al cambiar de pestaña
            board.resizeContainer(board.containerObj.clientWidth, board.containerObj.clientHeight);
        }

        paneles.forEach(id => {
            const el = document.getElementById(`params-${id}`);
            if (el) el.hidden = (id !== metodoActual);
        });

        document.getElementById('params-matriciales').hidden = !esMatricial;
        document.getElementById('params-iterativos-mat').hidden = !esIterativoMat;
    });
});

// ── JSXGRAPH (Inicialización del tablero) ────────────────────────────────────
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-5, 10, 5, -10],
    axis: true,
    showCopyright: false,
    zoom: { enabled: true, wheel: true, needShift: false },
    pan:  { enabled: true, needShift: false, needTwoFingers: false },
});

// Array global para limpiar los elementos dibujados en cada clic
let elementosGraficos = [];

function limpiarGrafico() {
    elementosGraficos.forEach(obj => board.removeObject(obj));
    elementosGraficos = [];
}

// ── CALCULAR ──────────────────────────────────────────────────────────────────
document.getElementById('btn-calcular').addEventListener('click', () => {
    const metodo  = document.querySelector('input[name="metodo"]:checked').value;
    const maxIter = 100;
    const esMatricial = panelesMatriciales.includes(metodo);

    // Limpieza total antes del nuevo cálculo
    limpiarGrafico();

    try {
        let resultado, funcStr;

        if (!esMatricial) {
            // ─── COMPORTAMIENTO: MODO RAÍCES ───
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
                else if (metodo === 'regla-trapezoidal') {
                funcStr      = document.getElementById('func').value;
                const a      = parseFloat(document.getElementById('trap-a').value);
                const b      = parseFloat(document.getElementById('trap-b').value);
                const n      = parseInt(document.getElementById('trap-n').value);
                const f      = x => math.evaluate(funcStr, { x });
                resultado    = reglaTrapezoidalComp(a, b, n, f);
            }
                else if (metodo === 'regla-trapezoidal-simple') {
                funcStr      = document.getElementById('func').value;
                const a      = parseFloat(document.getElementById('trap-simple-a').value);
                const b      = parseFloat(document.getElementById('trap-simple-b').value);
                const f      = x => math.evaluate(funcStr, { x });
                resultado    = reglaTrapezoidalSimple(a, b, f);
            }
                else if (metodo === 'simpson1-3') {
                funcStr      = document.getElementById('func').value;
                const a      = parseFloat(document.getElementById('simpson-a').value);
                const b      = parseFloat(document.getElementById('simpson-b').value);  
                const f      = x => math.evaluate(funcStr, { x });
                resultado    = reglaSimpson13Simple(a, b, f);
            } 
             
                else if (metodo === 'euler-modular') {
                funcStr      = document.getElementById('func').value;
                const xi     = parseFloat(document.getElementById('euler-xi').value);
                const yi     = parseFloat(document.getElementById('euler-yi').value);
                const xf     = parseFloat(document.getElementById('euler-xf').value);
                const dx     = parseFloat(document.getElementById('euler-dx').value);
                const xout   = parseFloat(document.getElementById('euler-xout').value);
                const derivs = (x, y) => math.evaluate(funcStr, { x, y });
                resultado    = metodoEulerModular(xi, yi, xf, dx, xout, derivs);
            } 
            else if (metodo === 'rk4-modular') {
                funcStr      = document.getElementById('func').value; 
                const xi     = parseFloat(document.getElementById('rk4-xi').value);
                const xf     = parseFloat(document.getElementById('rk4-xf').value);
                const dx     = parseFloat(document.getElementById('rk4-dx').value);
                const xout   = parseFloat(document.getElementById('rk4-xout').value);

                // Capturamos las condiciones iniciales permitiendo sistemas acoplados (ej: "1, 0")
                const yiStr  = document.getElementById('rk4-yi').value;
                const yiArray = yiStr.split(',').map(v => parseFloat(v.trim()));

                // El evaluador derivs maneja el sistema de ecuaciones. Si ingresas una única ecuación,
                // math.js la evaluará pasando el primer elemento del arreglo y[0].
                const derivs = (x, y) => {
                    // Si es un sistema complejo podés parsear funciones separadas por comas, 
                    // pero para una EDO estándar f(x,y) o sistema simple:
                    let resEval = math.evaluate(funcStr, { x: x, y: y[0] });
                    return Array.isArray(resEval) ? resEval : [resEval];
                };

                resultado    = metodoRK4Modular(xi, yiArray, xf, dx, xout, derivs);
            }
                

            const { raiz, pasos } = resultado;
            const errorFinal = pasos[pasos.length - 1].error;

            // Renderizar textos en pantalla
            document.getElementById('res-raiz').innerHTML = `x = ${raiz.toFixed(6)}`;
            document.getElementById('res-iter').textContent  = pasos.length;
            document.getElementById('res-error').textContent = errorFinal.toExponential(4);

            // GRAFICAR EN 2D PARA RAÍCES
            board.setBoundingBox([-5, 10, 5, -10]); // Resetear escala estándar
            
            let curva = board.create('functiongraph', [x => math.evaluate(funcStr, { x })], {
                strokeColor: '#6B8E23', strokeWidth: 2
            });
            let puntoRaiz = board.create('point', [raiz, 0], {
                name: `x = ${raiz.toFixed(4)}`, color: '#D35400', size: 4, fixed: true
            });
            
            elementosGraficos.push(curva, puntoRaiz);

        } else {
            // ─── COMPORTAMIENTO: MODO MATRICIAL ───
            const n = parseInt(document.getElementById('mat-n').value);
            let A = [];
            let b = [];

            // Capturar coeficientes
            for (let i = 0; i < n; i++) {
                let fila = [];
                for (let j = 0; j < n; j++) {
                    fila.push(parseFloat(document.getElementById(`A_${i}_${j}`).value) || 0);
                }
                A.push(fila);
                b.push(parseFloat(document.getElementById(`b_${i}`).value) || 0);
            }

            if (metodo === 'gauss-simple') {
                resultado = metodoGaussSimple(A, b);
            } else if (metodo === 'gauss-jordan') {
                resultado = metodoGaussJordan(A, b);
            } else if (metodo === 'jacobi' || metodo === 'gauss-seidel') {
                const tol = parseFloat(document.getElementById('mat-tol').value) || 0.0001;
                const x0Str = document.getElementById('mat-x0').value;
                const x0 = x0Str.split(',').map(val => parseFloat(val.trim()) || 0);
                
                if (x0.length !== n) throw new Error(`El vector X0 requiere exactamente ${n} elementos.`);

                if (metodo === 'jacobi') {
                    resultado = metodoJacobi(A, b, x0, tol, maxIter);
                } else {
                    resultado = metodoGaussSeidel(A, b, x0, tol, maxIter);
                }
            }

            const { solucion, pasos } = resultado;
            const errorFinal = pasos[pasos.length - 1].error;

            let solucionHTML = solucion.map((val, idx) => `X<sub>${idx+1}</sub> = ${val.toFixed(6)}`).join('<br>');
            document.getElementById('res-raiz').innerHTML = solucionHTML;
            
            const esIterativo = (metodo === 'jacobi' || metodo === 'gauss-seidel');
            document.getElementById('res-iter').textContent  = esIterativo ? pasos.length : 'Directo (1)';
            document.getElementById('res-error').textContent = esIterativo ? errorFinal.toExponential(4) : '0.0000';

            // GRÁFICO DE CONVERGENCIA DE ERROR (Solo Jacobi y Gauss-Seidel)
            if (esIterativo && pasos.length > 0) {
                let cantIteraciones = pasos.length;
                let errorInicial = pasos[0].error || 1;
                
                // Redimensionar los límites del gráfico dinámicamente
                board.setBoundingBox([-1, errorInicial * 1.3, cantIteraciones + 1, -(errorInicial * 0.1)]);

                let listaX = [];
                let listaY = [];

                pasos.forEach(p => {
                    listaX.push(p.iter);
                    listaY.push(p.error);

                    // Crear los puntos flotantes individuales por cada iteración
                    let punto = board.create('point', [p.iter, p.error], {
                        name: `I:${p.iter}`, size: 3, color: '#16a085', fixed: true, withLabel: true
                    });
                    elementosGraficos.push(punto);
                });

                // Conectar los puntos usando un elemento 'curve' nativo de JSXGraph
                if (listaX.length > 1) {
                    let lineaConvergencia = board.create('curve', [listaX, listaY], {
                        strokeColor: '#e74c3c', strokeWidth: 3
                    });
                    elementosGraficos.push(lineaConvergencia);
                }
            }
        }

    } catch (e) {
        document.getElementById('res-raiz').textContent  = 'ERROR';
        document.getElementById('res-iter').textContent  = '---';
        document.getElementById('res-error').textContent = e.message;
    }
});
