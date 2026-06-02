// Módulo: campos de función con teclado matemático MathLive
// Solo aplica a los inputs de funciones matemáticas (no a matrices ni parámetros numéricos)

const MATH_FIELD_IDS = ['func-raices', 'func-integrales', 'func-edo'];

function initMathFields() {
    if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.keypressSound = null;
    }

    MATH_FIELD_IDS.forEach(id => {
        const mf = document.getElementById(id);
        if (!mf || typeof mf.getValue !== 'function') return;
        mf.virtualKeyboardMode = 'onfocus';
        mf.keypressSound = null;
    });
}

// Devuelve el valor del campo en formato compatible con math.js
// Si es un math-field usa ascii-math; si es un input normal usa .value
function getMathValue(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    if (typeof el.getValue === 'function') {
        return el.getValue('ascii-math');
    }
    return el.value;
}

document.addEventListener('DOMContentLoaded', initMathFields);
