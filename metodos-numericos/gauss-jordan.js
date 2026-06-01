function metodoGaussJordan(A, b) {
    let n = A.length;
    let M = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
        if (Math.abs(M[i][i]) < 1e-12) {
            throw new Error("Pivote nulo detectado en Gauss-Jordan.");
        }
        let pivote = M[i][i];
        for (let k = i; k <= n; k++) {
            M[i][k] /= pivote;
        }
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let factor = M[j][i];
                for (let k = i; k <= n; k++) {
                    M[j][k] -= factor * M[i][k];
                }
            }
        }
    }

    let x = M.map(row => row[n]);
    return { solucion: x, pasos: [{ iter: 1, error: 0 }] };
}
