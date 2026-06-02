function reglaTrapezoidal(h, f0, fn) {
    return (h / 2) * (f0 + fn);
}

function reglaTrapezoidalComp(a, b, n, f) {
    let h = (b - a) / n;
    let suma = 0;
    let pasos = [];
    for (let i = 1; i < n; i++) {
        let xi = a + i * h;
        let fxi = f(xi);
        suma += fxi;
        // Mantener la estructura de objetos por iteración para la tabla 
        pasos.push({ iter: i, a: xi, b: null, c: xi, fc: fxi, error: 0 });
    }
    let resultado = (h / 2) * (f(a) + 2 * suma + f(b));
    return { raiz: resultado, pasos: pasos }; // Usamos 'raiz' para que enganche directo con el formato de script.js
}