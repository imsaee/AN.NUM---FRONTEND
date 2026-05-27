function metodoBiseccion(f, a, b, tol, maxIter) {
    if (f(a) * f(b) > 0) throw new Error("Signos iguales en los extremos.");
    let pasos = [], c = a;
    for (let i = 1; i <= maxIter; i++) {
        let cOld = c;
        c = (a + b) / 2;
        let fc = f(c);
        let error = i > 1 ? Math.abs(c - cOld) : Math.abs(b - a) / 2;
        pasos.push({ iter: i, a, b, c, fc, error });
        if (Math.abs(fc) < tol || error < tol) break;
        if (f(a) * fc < 0) b = c; else a = c;
    }
    return { raiz: c, pasos };
}
