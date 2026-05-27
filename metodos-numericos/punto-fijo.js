function metodoPuntoFijo(g, x0, tol, maxIter) {
    let pasos = [], xn = x0;
    for (let i = 1; i <= maxIter; i++) {
        let xNext = g(xn);
        let error = Math.abs(xNext - xn);
        pasos.push({ iter: i, a: xn, b: null, c: xNext, fc: xNext, error });
        if (error < tol) { xn = xNext; break; }
        xn = xNext;
        if (i === maxIter) throw new Error("Divergencia.");
    }
    return { raiz: xn, pasos };
}
