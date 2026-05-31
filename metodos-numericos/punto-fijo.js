function metodoPuntoFijo(g, x0, tol, maxIter) {
    let pasos = [];
    let xn = x0;

    for (let i = 1; i <= maxIter; i++) {
        let xNext = g(xn);

        // 1. Salvavidas: Detectar explosión numérica antes de que rompa la UI
        if (!isFinite(xNext) || isNaN(xNext)) {
            throw new Error("Divergencia extrema: La función creció demasiado rápido. Prueba con otro despeje g(x).");
        }

        let error = Math.abs(xNext - xn);
        
        // 2. Coherencia visual: Mandamos g(x) - x para que el usuario vea cómo tiende a 0
        let fx = xNext - xn; 

        pasos.push({ iter: i, a: xn, b: null, c: xNext, fc: fx, error });

        if (error < tol) {
            xn = xNext;
            break;
        }

        xn = xNext;

        // 3. Verificación final de divergencia estándar
        if (i === maxIter) {
            throw new Error("Divergencia: Se alcanzó el límite de iteraciones sin llegar a la tolerancia.");
        }
    }
    
    return { raiz: xn, pasos };
}