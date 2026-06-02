function reglaTrapezoidalSimple(a, b, f) {
    let h = b - a;
    let fa = f(a);
    let fb = f(b);
    
    let resultado = (h / 2) * (fa + fb);
    
    // Devolvemos un paso único para que la interfaz y la consola lo registren sin romperse
    let pasos = [{ iter: 1, a: a, b: b, c: (a + b) / 2, fc: resultado, error: 0 }];
    
    return { raiz: resultado, pasos: pasos };
}