function metodoGaussSeidel(A, b, x0, tol, maxIter) {
    let n = A.length;
    let x = [...x0];
    let pasos = [];

    // --- MEJORA 2: Validación preventiva fuera de los bucles ---
    for (let i = 0; i < n; i++) {
        if (Math.abs(A[i][i]) < 1e-12) {
            throw new Error(`División por cero detectada en la diagonal de la fila ${i} antes de empezar.`);
        }
    }

    for (let k = 0; k < maxIter; k++) {
        let xVieja = [...x];
        
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) suma += A[i][j] * x[j]; // Gauss-Seidel lee los x[j] recién actualizados
            }
            x[i] = (b[i] - suma) / A[i][i];
        }

        let maxNum = 0, maxDen = 0;
        for (let i = 0; i < n; i++) {
            let diff = Math.abs(x[i] - xVieja[i]);
            if (diff > maxNum) maxNum = diff;
            if (Math.abs(x[i]) > maxDen) maxDen = Math.abs(x[i]);
        }
        let error = maxDen === 0 ? 0 : maxNum / maxDen;

        // --- MEJORA 3: Salvavidas para evitar divergencia descontrolada ---
        if (isNaN(error) || !isFinite(error)) {
            throw new Error(`El método de Gauss-Seidel divergió en la iteración ${k + 1}. Comprueba si la matriz es diagonalmente dominante.`);
        }

        // --- MEJORA 1: Copia profunda de x para que la UI pueda armar la tabla ---
        pasos.push({ 
            iter: k + 1, 
            valores: [...x], // Guardamos la "foto" de las x en esta iteración
            error: error 
        });

        if (error < tol) return { solucion: x, pasos };
    }
    return { solucion: x, pasos };
}
