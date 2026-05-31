function metodoRegulaFalsi(f, a, b, tol, maxIter) {
    // 1. Evaluamos iniciales fuera del bucle
    let fa = f(a);
    let fb = f(b);

    // Prevención de overflow usando Math.sign
    if (Math.sign(fa) === Math.sign(fb)) {
        throw new Error("Signos iguales en los extremos.");
    }

    let pasos = [];
    let c = a; 

    for (let i = 1; i <= maxIter; i++) {
        let cOld = c;
        
        // 2. Calculamos c usando las variables ya guardadas en memoria
        c = b - (fb * (b - a)) / (fb - fa);
        
        // 3. Evaluamos la función en el nuevo punto (la ÚNICA evaluación pesada del ciclo)
        let fc = f(c);
        
        // 4. Calculamos el error (en la iteración 1 tomamos el largo del intervalo)
        let error = i > 1 ? Math.abs(c - cOld) : Math.abs(b - a);
        
        pasos.push({ iter: i, a, b, c, fc, error });
        
        if (Math.abs(fc) < tol || error < tol) break;
        
        // 5. 
        // Sobreescribimos el extremo y su función YA calculada
        if (fa * fc < 0) {
            b = c;
            fb = fc; // <-- Solo actualizamos fb
        } else {
            a = c;
            fa = fc; // <-- Solo actualizamos fa
        }
    }
    
    return { raiz: c, pasos };
}