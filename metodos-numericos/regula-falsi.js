function metodoRegulaFalsi(f, a, b, tol, maxIter) {
    if (f(a) * f(b) > 0) throw new Error("Signos iguales.");
    let pasos = [], c = a;
    for (let i = 1; i <= maxIter; i++) {
        let cOld = c, fa = f(a), fb = f(b);
        c = b - (fb * (b - a)) / (fb - fa);
        let fc = f(c);
        let error = Math.abs(c - cOld);
        pasos.push({ iter: i, a, b, c, fc, error });
        if (Math.abs(fc) < tol || error < tol) break;
        if (fa * fc < 0) b = c; else a = c;
    }
    return { raiz: c, pasos };
}
