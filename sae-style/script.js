// ==================== ESPERAR A QUE EL DOM ESTÉ LISTO ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== SISTEMA DE PESTAÑAS ====================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
    
    // ==================== INICIALIZAR GRÁFICAS ====================
    const boardRaices = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-5, 10, 5, -10],
        axis: true,
        showCopyright: false,
        zoom: { enabled: true, wheel: true, needShift: false },
        pan: { enabled: true, needShift: false, needTwoFingers: false },
    });
    
    const boardIntegrales = JXG.JSXGraph.initBoard('jxgbox2', {
        boundingbox: [-1, 5, 5, -1],
        axis: true,
        showCopyright: false,
        zoom: { enabled: true, wheel: true, needShift: false },
        pan: { enabled: true, needShift: false, needTwoFingers: false },
    });
    
    let curvaRaices = null;
    let puntoRaiz = null;
    let curvaIntegrales = null;
    
    // ==================== FUNCIONES AUXILIARES ====================
    function formatearResultado(valor) {
        if (valor === undefined || valor === null) return '---';
        if (typeof valor === 'number') return valor.toFixed(6);
        if (Array.isArray(valor)) return `[${valor.map(v => v.toFixed(6)).join(', ')}]`;
        return String(valor);
    }
    
    function parseMatrix(str) {
        return str.split(';').map(row => row.split(',').map(Number));
    }
    
    function parseVector(str) {
        return str.split(';').map(Number);
    }
    
    // ==================== PESTAÑA 1: RAÍCES ====================
    const panelesRaices = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
    
    function actualizarParametrosRaices() {
        const metodo = document.querySelector('input[name="metodo-raices"]:checked');
        if (!metodo) return;
        panelesRaices.forEach(id => {
            const panel = document.getElementById(`params-${id}`);
            if (panel) panel.style.display = (id === metodo.value) ? 'flex' : 'none';
        });
    }
    
    function actualizarEstiloBotonesRaices() {
        document.querySelectorAll('#selector-metodos-raices .method-btn').forEach(btn => btn.classList.remove('active'));
        const radio = document.querySelector('input[name="metodo-raices"]:checked');
        if (radio) radio.closest('.method-btn').classList.add('active');
    }
    
    document.querySelectorAll('input[name="metodo-raices"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarParametrosRaices();
            actualizarEstiloBotonesRaices();
        });
    });
    
    let resultadosRaices = {};
    
    const nombresRaices = {
        'biseccion': 'Bisección',
        'regula-falsi': 'Regula Falsi',
        'newton': 'Newton-Raphson',
        'secante': 'Secante',
        'punto-fijo': 'Punto Fijo'
    };
    
    // Guardar resultado SIN mostrar comparación
    function guardarResultadoRaiz(metodo, raiz, iteraciones, error, exito) {
        resultadosRaices[metodo] = {
            nombre: nombresRaices[metodo],
            resultado: formatearResultado(raiz),
            iteraciones: iteraciones || '---',
            error: (error && typeof error === 'number') ? error.toExponential(4) : (error || '---'),
            exito: exito,
            errorNum: (typeof error === 'number') ? error : Infinity
        };
        actualizarTablaRaicesSinMejor();
    }
    
    // Actualizar tabla SIN mostrar el mejor método
    function actualizarTablaRaicesSinMejor() {
        const tbody = document.getElementById('comparison-body-raices');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const orden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
        orden.forEach(metodo => {
            const res = resultadosRaices[metodo];
            const row = tbody.insertRow();
            if (res) {
                row.insertCell(0).textContent = res.nombre;
                row.insertCell(1).textContent = res.resultado;
                row.insertCell(2).textContent = res.iteraciones;
                row.insertCell(3).textContent = res.error;
                row.insertCell(4).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
                row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
                row.classList.remove('best-result');
            } else {
                row.insertCell(0).textContent = nombresRaices[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            }
        });
        
        const bestSection = document.getElementById('best-method-raices');
        if (bestSection) bestSection.style.display = 'none';
    }
    
    // Mostrar comparación SOLO al presionar el botón
    function mostrarComparacionRaices() {
        const tbody = document.getElementById('comparison-body-raices');
        if (!tbody) return;
        
        // Encontrar el mejor método
        let mejorMetodo = null;
        let menorError = Infinity;
        
        for (const [metodo, res] of Object.entries(resultadosRaices)) {
            if (res.exito && res.errorNum < menorError && res.errorNum !== Infinity) {
                menorError = res.errorNum;
                mejorMetodo = metodo;
            }
        }
        
        // Reconstruir tabla con resaltado
        tbody.innerHTML = '';
        const orden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
        orden.forEach(metodo => {
            const res = resultadosRaices[metodo];
            const row = tbody.insertRow();
            if (res) {
                row.insertCell(0).textContent = res.nombre;
                row.insertCell(1).textContent = res.resultado;
                row.insertCell(2).textContent = res.iteraciones;
                row.insertCell(3).textContent = res.error;
                row.insertCell(4).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
                row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
                if (mejorMetodo === metodo) row.classList.add('best-result');
            } else {
                row.insertCell(0).textContent = nombresRaices[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            }
        });
        
        const bestSection = document.getElementById('best-method-raices');
        if (bestSection && mejorMetodo && menorError !== Infinity) {
            const mejor = resultadosRaices[mejorMetodo];
            bestSection.style.display = 'block';
            document.getElementById('best-name-raices').textContent = mejor.nombre;
            document.getElementById('best-details-raices').innerHTML = `Error: ${menorError.toExponential(4)} | Iteraciones: ${mejor.iteraciones} | Raíz: ${mejor.resultado}`;
        } else if (bestSection && Object.keys(resultadosRaices).length > 0) {
            bestSection.style.display = 'block';
            document.getElementById('best-name-raices').textContent = 'Sin resultados exitosos';
            document.getElementById('best-details-raices').innerHTML = 'Ningún método convergió a una solución.';
        } else if (bestSection) {
            bestSection.style.display = 'none';
        }
    }
    
    function limpiarRaices() {
        resultadosRaices = {};
        const tbody = document.getElementById('comparison-body-raices');
        if (tbody) {
            const orden = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
            tbody.innerHTML = '';
            orden.forEach(metodo => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = nombresRaices[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            });
        }
        const bestSection = document.getElementById('best-method-raices');
        if (bestSection) bestSection.style.display = 'none';
        document.getElementById('res-raiz').textContent = '---';
        document.getElementById('res-iter').textContent = '---';
        document.getElementById('res-error').textContent = '---';
    }
    
    // Calcular raíces
    document.getElementById('btn-calcular-raices').addEventListener('click', function() {
        const metodo = document.querySelector('input[name="metodo-raices"]:checked');
        if (!metodo) return;
        const metodoValue = metodo.value;
        const maxIter = 100;
        const funcStr = document.getElementById('func-raices').value;
        const f = x => math.evaluate(funcStr, { x });
        
        try {
            let resultado, iteraciones = 0, errorFinal = 0;
            
            if (metodoValue === 'biseccion') {
                resultado = metodoBiseccion(f, 
                    parseFloat(document.getElementById('bis-a').value),
                    parseFloat(document.getElementById('bis-b').value),
                    parseFloat(document.getElementById('bis-tol').value), maxIter);
            } else if (metodoValue === 'regula-falsi') {
                resultado = metodoRegulaFalsi(f,
                    parseFloat(document.getElementById('rf-a').value),
                    parseFloat(document.getElementById('rf-b').value),
                    parseFloat(document.getElementById('rf-tol').value), maxIter);
            } else if (metodoValue === 'newton') {
                const df = x => math.derivative(funcStr, 'x').evaluate({ x });
                resultado = metodoNewton(f, df,
                    parseFloat(document.getElementById('nr-x0').value),
                    parseFloat(document.getElementById('nr-tol').value), maxIter);
            } else if (metodoValue === 'secante') {
                resultado = metodoSecante(f,
                    parseFloat(document.getElementById('sc-x0').value),
                    parseFloat(document.getElementById('sc-x1').value),
                    parseFloat(document.getElementById('sc-tol').value), maxIter);
            } else if (metodoValue === 'punto-fijo') {
                resultado = metodoPuntoFijo(f,
                    parseFloat(document.getElementById('pf-x0').value),
                    parseFloat(document.getElementById('pf-tol').value), maxIter);
            }
            
            iteraciones = resultado.pasos.length;
            errorFinal = resultado.pasos[iteraciones - 1].error;
            const raiz = resultado.raiz;
            
            document.getElementById('res-raiz').textContent = raiz.toFixed(6);
            document.getElementById('res-iter').textContent = iteraciones;
            document.getElementById('res-error').textContent = errorFinal.toExponential(4);
            
            guardarResultadoRaiz(metodoValue, raiz, iteraciones, errorFinal, true);
            
            if (curvaRaices) boardRaices.removeObject(curvaRaices);
            if (puntoRaiz) boardRaices.removeObject(puntoRaiz);
            curvaRaices = boardRaices.create('functiongraph', [x => math.evaluate(funcStr, { x })], { strokeColor: '#197278', strokeWidth: 2 });
            puntoRaiz = boardRaices.create('point', [raiz, 0], { name: `x = ${raiz.toFixed(4)}`, color: '#c44536', size: 4, fixed: true });
            
        } catch (e) {
            console.error(e);
            document.getElementById('res-raiz').textContent = 'ERROR';
            document.getElementById('res-error').textContent = e.message;
            guardarResultadoRaiz(metodoValue, null, null, e.message, false);
        }
    });
    
    // Botón COMPARAR (solo aquí se muestra el mejor método)
    document.getElementById('compare-all-raices').addEventListener('click', function() {
        if (Object.keys(resultadosRaices).length === 0) {
            alert('⚠️ No hay resultados. Calcula al menos un método.');
            return;
        }
        mostrarComparacionRaices();
    });
    
    document.getElementById('clear-raices').addEventListener('click', limpiarRaices);
    
    // ==================== PESTAÑA 2: INTEGRALES (solo registro) ====================
    const panelesIntegrales = ['trapezoidal-simple', 'trapezoidal-comp', 'simpson13'];
    
    function actualizarParametrosIntegrales() {
        const metodo = document.querySelector('input[name="metodo-integrales"]:checked');
        if (!metodo) return;
        panelesIntegrales.forEach(id => {
            const panel = document.getElementById(`params-integral-${id}`);
            if (panel) panel.style.display = (id === metodo.value) ? 'flex' : 'none';
        });
    }
    
    function actualizarEstiloBotonesIntegrales() {
        document.querySelectorAll('#selector-metodos-integrales .method-btn').forEach(btn => btn.classList.remove('active'));
        const radio = document.querySelector('input[name="metodo-integrales"]:checked');
        if (radio) radio.closest('.method-btn').classList.add('active');
    }
    
    document.querySelectorAll('input[name="metodo-integrales"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarParametrosIntegrales();
            actualizarEstiloBotonesIntegrales();
        });
    });
    
    let resultadosIntegrales = {};
    
    const nombresIntegrales = {
        'trapezoidal-simple': 'Trapezoidal Simple',
        'trapezoidal-comp': 'Trapezoidal Compuesta',
        'simpson13': 'Simpson 1/3'
    };
    
    function actualizarTablaIntegrales() {
        const tbody = document.getElementById('comparison-body-integrales');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const orden = ['trapezoidal-simple', 'trapezoidal-comp', 'simpson13'];
        orden.forEach(metodo => {
            const res = resultadosIntegrales[metodo];
            const row = tbody.insertRow();
            if (res) {
                row.insertCell(0).textContent = res.nombre;
                row.insertCell(1).textContent = res.resultado;
                row.insertCell(2).textContent = res.iteraciones;
                row.insertCell(3).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
                row.cells[3].style.color = res.exito ? '#28a745' : '#dc3545';
            } else {
                row.insertCell(0).textContent = nombresIntegrales[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            }
        });
    }
    
    function limpiarIntegrales() {
        resultadosIntegrales = {};
        const tbody = document.getElementById('comparison-body-integrales');
        if (tbody) {
            const orden = ['trapezoidal-simple', 'trapezoidal-comp', 'simpson13'];
            tbody.innerHTML = '';
            orden.forEach(metodo => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = nombresIntegrales[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            });
        }
        document.getElementById('res-integral').textContent = '---';
        document.getElementById('res-integral-iter').textContent = '---';
    }
    
    document.getElementById('btn-calcular-integrales').addEventListener('click', function() {
        const metodo = document.querySelector('input[name="metodo-integrales"]:checked');
        if (!metodo) return;
        const metodoValue = metodo.value;
        const funcStr = document.getElementById('func-integrales').value;
        const f = x => math.evaluate(funcStr, { x });
        
        try {
            let resultado, iteraciones = 1;
            
            if (metodoValue === 'trapezoidal-simple') {
                const a = parseFloat(document.getElementById('int-trap-simple-a').value);
                const b = parseFloat(document.getElementById('int-trap-simple-b').value);
                resultado = reglaTrapezoidalSimple(a, b, f);
            } else if (metodoValue === 'trapezoidal-comp') {
                const a = parseFloat(document.getElementById('int-trap-comp-a').value);
                const b = parseFloat(document.getElementById('int-trap-comp-b').value);
                const n = parseInt(document.getElementById('int-trap-comp-n').value);
                resultado = reglaTrapezoidalComp(a, b, n, f);
                iteraciones = n;
            } else if (metodoValue === 'simpson13') {
                const a = parseFloat(document.getElementById('int-simp-a').value);
                const b = parseFloat(document.getElementById('int-simp-b').value);
                resultado = reglaSimpson13Simple(a, b, f);
            }
            
            const valor = resultado.raiz;
            document.getElementById('res-integral').textContent = valor.toFixed(6);
            document.getElementById('res-integral-iter').textContent = iteraciones;
            
            resultadosIntegrales[metodoValue] = {
                nombre: nombresIntegrales[metodoValue],
                resultado: formatearResultado(valor),
                iteraciones: iteraciones,
                exito: true
            };
            actualizarTablaIntegrales();
            
            if (curvaIntegrales) boardIntegrales.removeObject(curvaIntegrales);
            curvaIntegrales = boardIntegrales.create('functiongraph', [x => math.evaluate(funcStr, { x })], { strokeColor: '#197278', strokeWidth: 2 });
            
        } catch (e) {
            console.error(e);
            document.getElementById('res-integral').textContent = 'ERROR';
            resultadosIntegrales[metodoValue] = {
                nombre: nombresIntegrales[metodoValue],
                resultado: 'ERROR',
                iteraciones: '---',
                exito: false
            };
            actualizarTablaIntegrales();
        }
    });
    
    document.getElementById('clear-integrales').addEventListener('click', limpiarIntegrales);
    
    // ==================== PESTAÑA 3: EDO (solo registro) ====================
    const panelesEDO = ['euler', 'rk4'];
    
    function actualizarParametrosEDO() {
        const metodo = document.querySelector('input[name="metodo-edo"]:checked');
        if (!metodo) return;
        panelesEDO.forEach(id => {
            const panel = document.getElementById(`params-edo-${id}`);
            if (panel) panel.style.display = (id === metodo.value) ? 'flex' : 'none';
        });
    }
    
    function actualizarEstiloBotonesEDO() {
        document.querySelectorAll('#selector-metodos-edo .method-btn').forEach(btn => btn.classList.remove('active'));
        const radio = document.querySelector('input[name="metodo-edo"]:checked');
        if (radio) radio.closest('.method-btn').classList.add('active');
    }
    
    document.querySelectorAll('input[name="metodo-edo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarParametrosEDO();
            actualizarEstiloBotonesEDO();
        });
    });
    
    let resultadosEDO = {};
    
    const nombresEDO = { 'euler': 'Euler', 'rk4': 'Runge-Kutta 4' };
    
    function actualizarTablaEDO() {
        const tbody = document.getElementById('comparison-body-edo');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const orden = ['euler', 'rk4'];
        orden.forEach(metodo => {
            const res = resultadosEDO[metodo];
            const row = tbody.insertRow();
            if (res) {
                row.insertCell(0).textContent = res.nombre;
                row.insertCell(1).textContent = res.resultado;
                row.insertCell(2).textContent = res.pasos;
                row.insertCell(3).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
                row.cells[3].style.color = res.exito ? '#28a745' : '#dc3545';
            } else {
                row.insertCell(0).textContent = nombresEDO[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            }
        });
    }
    
    function limpiarEDO() {
        resultadosEDO = {};
        const tbody = document.getElementById('comparison-body-edo');
        if (tbody) {
            const orden = ['euler', 'rk4'];
            tbody.innerHTML = '';
            orden.forEach(metodo => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = nombresEDO[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            });
        }
        document.getElementById('res-edo').textContent = '---';
        document.getElementById('res-edo-pasos').textContent = '---';
    }
    
    document.getElementById('btn-calcular-edo').addEventListener('click', function() {
        const metodo = document.querySelector('input[name="metodo-edo"]:checked');
        if (!metodo) return;
        const metodoValue = metodo.value;
        const derivsStr = document.getElementById('func-edo').value;
        
        try {
            let resultado;
            
            if (metodoValue === 'euler') {
                const xi = parseFloat(document.getElementById('edo-euler-xi').value);
                const yi = parseFloat(document.getElementById('edo-euler-yi').value);
                const xf = parseFloat(document.getElementById('edo-euler-xf').value);
                const h = parseFloat(document.getElementById('edo-euler-h').value);
                const derivs = (x, y) => math.evaluate(derivsStr, { x, y });
                resultado = metodoEulerModular(xi, yi, xf, h, h, derivs);
            } else if (metodoValue === 'rk4') {
                const xi = parseFloat(document.getElementById('edo-rk4-xi').value);
                const yi = parseFloat(document.getElementById('edo-rk4-yi').value);
                const xf = parseFloat(document.getElementById('edo-rk4-xf').value);
                const h = parseFloat(document.getElementById('edo-rk4-h').value);
                const derivs = (x, y) => math.evaluate(derivsStr, { x, y });
                resultado = metodoRK4Modular(xi, [yi], xf, h, h, derivs);
            }
            
            const valor = resultado.raiz;
            const pasos = resultado.pasos.length;
            
            document.getElementById('res-edo').textContent = valor.toFixed(6);
            document.getElementById('res-edo-pasos').textContent = pasos;
            
            resultadosEDO[metodoValue] = {
                nombre: nombresEDO[metodoValue],
                resultado: formatearResultado(valor),
                pasos: pasos,
                exito: true
            };
            actualizarTablaEDO();
            
        } catch (e) {
            console.error(e);
            document.getElementById('res-edo').textContent = 'ERROR';
            resultadosEDO[metodoValue] = {
                nombre: nombresEDO[metodoValue],
                resultado: 'ERROR',
                pasos: '---',
                exito: false
            };
            actualizarTablaEDO();
        }
    });
    
    document.getElementById('clear-edo').addEventListener('click', limpiarEDO);
    
    // ==================== PESTAÑA 4: SISTEMAS LINEALES (solo registro) ====================
    const panelesSistemas = ['jacobi', 'gauss-seidel', 'gauss-simple', 'gauss-jordan'];
    
    function actualizarParametrosSistemas() {
        const metodo = document.querySelector('input[name="metodo-sistemas"]:checked');
        if (!metodo) return;
        panelesSistemas.forEach(id => {
            const panel = document.getElementById(`params-sis-${id}`);
            if (panel) panel.style.display = (id === metodo.value) ? 'flex' : 'none';
        });
    }
    
    function actualizarEstiloBotonesSistemas() {
        document.querySelectorAll('#selector-metodos-sistemas .method-btn').forEach(btn => btn.classList.remove('active'));
        const radio = document.querySelector('input[name="metodo-sistemas"]:checked');
        if (radio) radio.closest('.method-btn').classList.add('active');
    }
    
    document.querySelectorAll('input[name="metodo-sistemas"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarParametrosSistemas();
            actualizarEstiloBotonesSistemas();
        });
    });
    
    let resultadosSistemas = {};
    
    const nombresSistemas = {
        'jacobi': 'Jacobi',
        'gauss-seidel': 'Gauss-Seidel',
        'gauss-simple': 'Gauss Simple',
        'gauss-jordan': 'Gauss-Jordan'
    };
    
    function actualizarTablaSistemas() {
        const tbody = document.getElementById('comparison-body-sistemas');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const orden = ['jacobi', 'gauss-seidel', 'gauss-simple', 'gauss-jordan'];
        orden.forEach(metodo => {
            const res = resultadosSistemas[metodo];
            const row = tbody.insertRow();
            if (res) {
                row.insertCell(0).textContent = res.nombre;
                row.insertCell(1).textContent = res.resultado;
                row.insertCell(2).textContent = res.iteraciones;
                row.insertCell(3).textContent = res.error;
                row.insertCell(4).innerHTML = res.exito ? '✅ Éxito' : '❌ Error';
                row.cells[4].style.color = res.exito ? '#28a745' : '#dc3545';
            } else {
                row.insertCell(0).textContent = nombresSistemas[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            }
        });
    }
    
    function limpiarSistemas() {
        resultadosSistemas = {};
        const tbody = document.getElementById('comparison-body-sistemas');
        if (tbody) {
            const orden = ['jacobi', 'gauss-seidel', 'gauss-simple', 'gauss-jordan'];
            tbody.innerHTML = '';
            orden.forEach(metodo => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = nombresSistemas[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            });
        }
        document.getElementById('res-solucion').textContent = '---';
        document.getElementById('res-sis-iter').textContent = '---';
        document.getElementById('res-sis-error').textContent = '---';
    }
    
    document.getElementById('btn-calcular-sistemas').addEventListener('click', function() {
        const metodo = document.querySelector('input[name="metodo-sistemas"]:checked');
        if (!metodo) return;
        const metodoValue = metodo.value;
        const maxIter = 100;
        
        try {
            let resultado, iteraciones = 1, errorFinal = null;
            
            if (metodoValue === 'jacobi') {
                const A = parseMatrix(document.getElementById('sis-jacobi-A').value);
                const b = parseVector(document.getElementById('sis-jacobi-b').value);
                const x0 = parseVector(document.getElementById('sis-jacobi-x0').value);
                const tol = parseFloat(document.getElementById('sis-jacobi-tol').value);
                resultado = metodoJacobi(A, b, x0, tol, maxIter);
                iteraciones = resultado.pasos.length;
                errorFinal = resultado.pasos[iteraciones - 1]?.error || tol;
            } else if (metodoValue === 'gauss-seidel') {
                const A = parseMatrix(document.getElementById('sis-gs-A').value);
                const b = parseVector(document.getElementById('sis-gs-b').value);
                const x0 = parseVector(document.getElementById('sis-gs-x0').value);
                const tol = parseFloat(document.getElementById('sis-gs-tol').value);
                resultado = metodoGaussSeidel(A, b, x0, tol, maxIter);
                iteraciones = resultado.pasos.length;
                errorFinal = resultado.pasos[iteraciones - 1]?.error || tol;
            } else if (metodoValue === 'gauss-simple') {
                const A = parseMatrix(document.getElementById('sis-gauss-A').value);
                const b = parseVector(document.getElementById('sis-gauss-b').value);
                resultado = metodoGaussSimple(A, b);
                iteraciones = resultado.pasos?.length || 1;
                errorFinal = null;
            } else if (metodoValue === 'gauss-jordan') {
                const A = parseMatrix(document.getElementById('sis-gj-A').value);
                const b = parseVector(document.getElementById('sis-gj-b').value);
                resultado = metodoGaussJordan(A, b);
                iteraciones = 1;
                errorFinal = null;
            }
            
            const solucion = resultado.solucion;
            const errorDisplay = (errorFinal && typeof errorFinal === 'number') ? errorFinal.toExponential(4) : 'N/A';
            
            document.getElementById('res-solucion').textContent = formatearResultado(solucion);
            document.getElementById('res-sis-iter').textContent = iteraciones;
            document.getElementById('res-sis-error').textContent = errorDisplay;
            
            resultadosSistemas[metodoValue] = {
                nombre: nombresSistemas[metodoValue],
                resultado: formatearResultado(solucion),
                iteraciones: iteraciones,
                error: errorDisplay,
                exito: true
            };
            actualizarTablaSistemas();
            
        } catch (e) {
            console.error(e);
            document.getElementById('res-solucion').textContent = 'ERROR';
            document.getElementById('res-sis-error').textContent = e.message;
            resultadosSistemas[metodoValue] = {
                nombre: nombresSistemas[metodoValue],
                resultado: 'ERROR',
                iteraciones: '---',
                error: e.message,
                exito: false
            };
            actualizarTablaSistemas();
        }
    });
    
    document.getElementById('clear-sistemas').addEventListener('click', limpiarSistemas);
    
    // ==================== INICIALIZAR ====================
    actualizarParametrosRaices();
    actualizarEstiloBotonesRaices();
    actualizarParametrosIntegrales();
    actualizarEstiloBotonesIntegrales();
    actualizarParametrosEDO();
    actualizarEstiloBotonesEDO();
    actualizarParametrosSistemas();
    actualizarEstiloBotonesSistemas();
    
    // Inicializar tablas vacías
    function inicializarTablasVacias() {
        const ordenRaices = ['biseccion', 'regula-falsi', 'newton', 'secante', 'punto-fijo'];
        const tbodyRaices = document.getElementById('comparison-body-raices');
        if (tbodyRaices && tbodyRaices.children.length === 0) {
            ordenRaices.forEach(metodo => {
                const row = tbodyRaices.insertRow();
                row.insertCell(0).textContent = nombresRaices[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            });
        }
        
        const ordenIntegrales = ['trapezoidal-simple', 'trapezoidal-comp', 'simpson13'];
        const tbodyIntegrales = document.getElementById('comparison-body-integrales');
        if (tbodyIntegrales && tbodyIntegrales.children.length === 0) {
            ordenIntegrales.forEach(metodo => {
                const row = tbodyIntegrales.insertRow();
                row.insertCell(0).textContent = nombresIntegrales[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            });
        }
        
        const ordenEDO = ['euler', 'rk4'];
        const tbodyEDO = document.getElementById('comparison-body-edo');
        if (tbodyEDO && tbodyEDO.children.length === 0) {
            ordenEDO.forEach(metodo => {
                const row = tbodyEDO.insertRow();
                row.insertCell(0).textContent = nombresEDO[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).innerHTML = '⏳ Pendiente';
                row.cells[3].style.color = '#ffc107';
            });
        }
        
        const ordenSistemas = ['jacobi', 'gauss-seidel', 'gauss-simple', 'gauss-jordan'];
        const tbodySistemas = document.getElementById('comparison-body-sistemas');
        if (tbodySistemas && tbodySistemas.children.length === 0) {
            ordenSistemas.forEach(metodo => {
                const row = tbodySistemas.insertRow();
                row.insertCell(0).textContent = nombresSistemas[metodo];
                row.insertCell(1).textContent = '---';
                row.insertCell(2).textContent = '---';
                row.insertCell(3).textContent = '---';
                row.insertCell(4).innerHTML = '⏳ Pendiente';
                row.cells[4].style.color = '#ffc107';
            });
        }
    }
    
    inicializarTablasVacias();
    
});