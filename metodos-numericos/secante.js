function metodoSecante(f, x0, x1, tol, maxIter) {
    let pasos = [];
    
    // 1. Evaluamos los puntos iniciales UNA VEZ por fuera del bucle
    let fx0 = f(x0);
    let fx1 = f(x1);

    for (let i = 1; i <= maxIter; i++) {
        // Prevención de división por cero
        if (Math.abs(fx1 - fx0) < 1e-12) {
            throw new Error("División por cero. La recta secante es horizontal.");
        }
        
        // 2. Calculamos el nuevo punto x2 usando las variables en memoria
        let x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        let error = Math.abs(x2 - x1);
        
        // 3. La ÚNICA evaluación matemática pesada del ciclo
        let fx2 = f(x2);
        
        pasos.push({ iter: i, a: x0, b: x1, c: x2, fc: fx2, error });
        
        // 4. Usamos la variable fx2 para la condición de parada
        if (Math.abs(fx2) < tol || error < tol) {
            x1 = x2; // Aseguramos que la raíz a devolver sea el último punto calculado
            break;
        }
        
        // 5. Actualización Inteligente:
        // El punto 1 pasa a ser el punto 0 (junto con su función ya evaluada)
        x0 = x1;
        fx0 = fx1;
        
        // El nuevo punto 2 pasa a ser el punto 1 (junto con su función ya evaluada)
        x1 = x2;
        fx1 = fx2;
    }
    
    return { raiz: x1, pasos };
}