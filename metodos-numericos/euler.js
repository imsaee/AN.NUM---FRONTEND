// c) Método de Euler para un solo paso
function eulerPaso(x, y, h, derivs) {
    let dydx = derivs(x, y);
    let ynew = y + dydx * h;
    x = x + h;
    return { x, ynew };
}

// b) Rutina para tomar un paso de salida (Integrator)
function integrator(x, y, h, xend, derivs) {
    while (x < xend) {
        // Ajustar el tamaño del paso si nos vamos a pasar de xend
        if (xend - x < h) {
            h = xend - x;
        }
        
        let paso = eulerPaso(x, y, h, derivs);
        x = paso.x;
        y = paso.ynew;
    }
    return { x, y };
}

// a) Programa principal o "manejador"
function metodoEulerModular(xi, yi, xf, dx, xout, derivs) {
    let x = xi;
    let y = yi;
    let m = 0;
    
    // Array de pasos para que Sae arme la tabla en el frontend
    let pasos = [];
    pasos.push({ iter: m, a: x, b: null, c: x, fc: y, error: 0 });
    
    while (x < xf) {
        let xend = x + xout;
        if (xend > xf) {
            xend = xf;
        }
        let h = dx;
        
        let integrado = integrator(x, y, h, xend, derivs);
        x = integrado.x;
        y = integrado.y;
        
        m = m + 1;
        pasos.push({ iter: m, a: x, b: null, c: x, fc: y, error: 0 });
    }
    
    // Retornamos la 'raiz' (solución final de y) y los pasos para el visualizador
    return { raiz: y, pasos: pasos };
}