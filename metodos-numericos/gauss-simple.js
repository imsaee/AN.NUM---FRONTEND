function metodoGaussSimple(A, b) {
    let n = A.length;
    // Creamos la matriz aumentada M
    let M = A.map((row, i) => [...row, b[i]]);
    
    // Array para almacenar el historial real de matrices del paso a paso
    let pasosHistorial = [];

    // Guardamos el estado inicial de la matriz antes de empezar las operaciones
    pasosHistorial.push({
        descripcion: "Matriz aumentada inicial",
        matrizEstado: M.map(row => [...row]) // Copia profunda de la matriz actual
    });

    // --- ELIMINACIÓN HACIA ADELANTE ---
    for (let i = 0; i < n; i++) {
        if (Math.abs(M[i][i]) < 1e-12) {
            throw new Error("El pivote es cero o muy cercano a cero. Requiere pivoteo.");
        }

        for (let j = i + 1; j < n; j++) {
            let factor = M[j][i] / M[i][i];
            
            // 1. CORRECCIÓN DE PUNTO FLOTANTE: Forzamos el cero manual debajo del pivote
            M[j][i] = 0; 
            
            // 2. OPTIMIZACIÓN: El ciclo arranca en 'i + 1' en lugar de 'i'
            for (let k = i + 1; k <= n; k++) { 
                M[j][k] -= factor * M[i][k];
            }
        }

        // CORRECCIÓN DE PASOS: Guardamos el estado de la matriz tras limpiar la columna actual
        pasosHistorial.push({
            descripcion: `Eliminación debajo del pivote de la fila ${i + 1} (Columna ${i + 1})`,
            matrizEstado: M.map(row => [...row]) // Guardamos una copia exacta en este punto
        });
    }

    // --- SUSTITUCIÓN HACIA ATRÁS ---
    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let suma = 0;
        for (let j = i + 1; j < n; j++) {
            
            suma += M[i][j] * x[j];
        }
        x[i] = (M[i][n] - suma) / M[i][i];
    }

    // Retornamos la solución y el historial de pasos reales para que use tu interfaz
    return { 
        solucion: x, 
        pasos: pasosHistorial 
    };
}
