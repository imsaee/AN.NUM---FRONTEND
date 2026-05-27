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

// ── CALCULAR ──────────────────────────────────────────────────────────────────
document.getElementById('btn-calcular').addEventListener('click', () => {
    const metodo  = document.querySelector('input[name="metodo"]:checked').value;
    const maxIter = 100;

    try {
        let resultado, funcStr;

        if (metodo === 'biseccion') {
            funcStr      = document.getElementById('bis-func').value;
            const a      = parseFloat(document.getElementById('bis-a').value);
            const b      = parseFloat(document.getElementById('bis-b').value);
            const tol    = parseFloat(document.getElementById('bis-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoBiseccion(f, a, b, tol, maxIter);

        } else if (metodo === 'regula-falsi') {
            funcStr      = document.getElementById('rf-func').value;
            const a      = parseFloat(document.getElementById('rf-a').value);
            const b      = parseFloat(document.getElementById('rf-b').value);
            const tol    = parseFloat(document.getElementById('rf-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoRegulaFalsi(f, a, b, tol, maxIter);

        } else if (metodo === 'newton') {
            funcStr      = document.getElementById('nr-func').value;
            const x0     = parseFloat(document.getElementById('nr-x0').value);
            const tol    = parseFloat(document.getElementById('nr-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            const df     = x => math.derivative(funcStr, 'x').evaluate({ x });
            resultado    = metodoNewton(f, df, x0, tol, maxIter);

        } else if (metodo === 'secante') {
            funcStr      = document.getElementById('sc-func').value;
            const x0     = parseFloat(document.getElementById('sc-x0').value);
            const x1     = parseFloat(document.getElementById('sc-x1').value);
            const tol    = parseFloat(document.getElementById('sc-tol').value);
            const f      = x => math.evaluate(funcStr, { x });
            resultado    = metodoSecante(f, x0, x1, tol, maxIter);

        } else if (metodo === 'punto-fijo') {
            funcStr      = document.getElementById('pf-func').value;
            const x0     = parseFloat(document.getElementById('pf-x0').value);
            const tol    = parseFloat(document.getElementById('pf-tol').value);
            const g      = x => math.evaluate(funcStr, { x });
            resultado    = metodoPuntoFijo(g, x0, tol, maxIter);
        }

        const { raiz, pasos } = resultado;
        const errorFinal = pasos[pasos.length - 1].error;

        // Mostrar resultado en el DOM
        document.getElementById('res-raiz').textContent  = raiz.toFixed(6);
        document.getElementById('res-iter').textContent  = pasos.length;
        document.getElementById('res-error').textContent = errorFinal.toExponential(4);

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
    }
});
