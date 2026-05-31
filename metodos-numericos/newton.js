function metodoNewton(f, df, x0, tol, maxIter) {
    let pasos = [];
    let xn = x0;
    
    // 1. Evaluamos el punto inicial antes del bucle
    let fxn = f(xn); 

    // Verificamos si el usuario tuvo suerte y x0 ya es la raíz
    if (Math.abs(fxn) < tol) {
        pasos.push({ iter: 0, a: xn, b: null, c: xn, fc: fxn, error: 0 });
        return { raiz: xn, pasos };
    }

    for (let i = 1; i <= maxIter; i++) {
        let dfxn = df(xn);
        
        if (Math.abs(dfxn) < 1e-12) {
            throw new Error("Derivada nula o casi nula. División por cero evitada.");
        }
        
        let xNext = xn - (fxn / dfxn);
        let error = Math.abs(xNext - xn);
        
        // 2. Evaluamos el NUEVO punto UNA SOLA VEZ
        let fxNext = f(xNext); 
        
        pasos.push({ iter: i, a: xn, b: null, c: xNext, fc: fxNext, error });
        
        // 3. Usamos la variable ya calculada para la condición de parada
        if (Math.abs(fxNext) < tol || error < tol) {
            xn = xNext;
            break;
        }
        
        // 4. Actualización Inteligente: 
        // Pasamos el punto y su función ya evaluada a la siguiente iteración
        xn = xNext;
        fxn = fxNext; 
    }
    
    return { raiz: xn, pasos };
}