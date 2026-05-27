function metodoNewton(f, df, x0, tol, maxIter) {
    let pasos = [], xn = x0;
    for (let i = 1; i <= maxIter; i++) {
        let fxn = f(xn), dfxn = df(xn);
        if (Math.abs(dfxn) < 1e-12) throw new Error("Derivada nula.");
        let xNext = xn - fxn / dfxn;
        let error = Math.abs(xNext - xn);
        pasos.push({ iter: i, a: xn, b: null, c: xNext, fc: f(xNext), error });
        xn = xNext;
        if (Math.abs(f(xn)) < tol || error < tol) break;
    }
    return { raiz: xn, pasos };
}
