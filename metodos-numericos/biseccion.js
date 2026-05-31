function metodoBiseccion(f, a, b, tol, maxIter) {
    // Mejora 2: Usar Math.sign es a prueba de desbordamientos (overflows)
    if (Math.sign(f(a)) === Math.sign(f(b))) {
        throw new Error("Signos iguales en los extremos.");
    }
    
    let pasos = [], c = a;
    
    // Mejora 1: Evaluamos f(a) UNA SOLA VEZ antes del bucle para no saturar la CPU
    let fa = f(a); 
    
    for (let i = 1; i <= maxIter; i++) {
        let cOld = c;
        c = (a + b) / 2;
        let fc = f(c);
        let error = i > 1 ? Math.abs(c - cOld) : Math.abs(b - a) / 2;
        
        pasos.push({ iter: i, a, b, c, fc, error });
        
        if (Math.abs(fc) < tol || error < tol) break;
        
        // Comparamos usando la variable en memoria en lugar de recalcular f(a)
        if (fa * fc < 0) {
            b = c;
        } else {
            a = c;
            fa = fc; // Solo actualizamos 'fa' porque 'a' tomó la posición de 'c'
        }
    }
    return { raiz: c, pasos };
}