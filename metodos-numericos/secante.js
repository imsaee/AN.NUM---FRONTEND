function metodoSecante(f, x0, x1, tol, maxIter) {
    let pasos = [];
    for (let i = 1; i <= maxIter; i++) {
        let fx0 = f(x0), fx1 = f(x1);
        if (Math.abs(fx1 - fx0) < 1e-12) throw new Error("División por cero.");
        let x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        let error = Math.abs(x2 - x1);
        pasos.push({ iter: i, a: x0, b: x1, c: x2, fc: f(x2), error });
        x0 = x1; x1 = x2;
        if (Math.abs(f(x2)) < tol || error < tol) break;
    }
    return { raiz: x1, pasos };
}
