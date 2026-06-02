// c) Método RK de cuarto orden para un sistema de EDO
function rk4Paso(x, y, n, h, derivs) {
    // y es un arreglo de tamaño n conteniendo los valores de las variables dependientes
    let k1 = derivs(x, y);
    
    let ym = new Array(n);
    for (let i = 0; i < n; i++) {
        ym[i] = y[i] + k1[i] * h / 2;
    }
    let k2 = derivs(x + h / 2, ym);
    
    for (let i = 0; i < n; i++) {
        ym[i] = y[i] + k2[i] * h / 2;
    }
    let k3 = derivs(x + h / 2, ym);
    
    let ye = new Array(n);
    for (let i = 0; i < n; i++) {
        ye[i] = y[i] + k3[i] * h;
    }
    let k4 = derivs(x + h, ye);
    
    let yNext = new Array(n);
    for (let i = 0; i < n; i++) {
        let slope = (k1[i] + 2 * (k2[i] + k3[i]) + k4[i]) / 6;
        yNext[i] = y[i] + slope * h;
    }
    
    x = x + h;
    return { x, yNext };
}

// b) Rutina para tomar un paso de salida
function rk4Integrator(x, y, n, h, xend, derivs) {
    while (x < xend) {
        if (xend - x < h) {
            h = xend - x;
        }
        let paso = rk4Paso(x, y, n, h, derivs);
        x = paso.x;
        y = paso.yNext;
    }
    return { x, y };
}

// a) Programa principal o "manejador"
function metodoRK4Modular(xi, yiArray, xf, dx, xout, derivs) {
    let x = xi;
    let y = [...yiArray]; // Copia del arreglo inicial de variables dependientes
    let n = y.length;     // Cantidad de ecuaciones en el sistema
    let m = 0;
    
    let pasos = [];
    // Guardamos la primera variable dependiente y[0] como el valor principal para mostrar en la tabla
    pasos.push({ iter: m, a: x, b: null, c: x, fc: y[0], error: 0 });
    
    while (x < xf) {
        let xend = x + xout;
        if (xend > xf) {
            xend = xf;
        }
        let h = dx;
        
        let integrado = rk4Integrator(x, y, n, h, xend, derivs);
        x = integrado.x;
        y = integrado.y;
        
        m = m + 1;
        pasos.push({ iter: m, a: x, b: null, c: x, fc: y[0], error: 0 });
    }
    
    // Retornamos y[0] (o el arreglo completo si quisieras) y el historial de pasos
    return { raiz: y[0], pasos: pasos };
}