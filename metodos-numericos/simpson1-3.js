function reglaSimpson13Simple(a, b, f) {
    let h = (b - a) / 2; // El paso h entre f0, f1 y f2
    let f0 = f(a);
    let f1 = f(a + h); // Punto medio (m)
    let f2 = f(b);
    
    //fórmula exacta: (2*h*(f0 + 4*f1 + f2)) / 6
    let resultado = (2 * h * (f0 + 4 * f1 + f2)) / 6;
    
    // Devolver el array de pasos simulado para mantener compatibilidad con la UI
    let pasos = [{ iter: 1, a: a, b: b, c: a + h, fc: resultado, error: 0 }];
    
    return { raiz: resultado, pasos: pasos }; // Mapeado a 'raiz' para script.js
}