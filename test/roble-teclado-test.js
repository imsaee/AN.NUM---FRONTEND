const mf = document.getElementById('ent-func');
const outputLatex = document.getElementById('output-latex');

mf.virtualKeyboardMode = 'onfocus';
mf.keypressSound = null;
if (window.mathVirtualKeyboard) {
    window.mathVirtualKeyboard.keypressSound = null;
}

// Fix v2: menú desplegable del teclado virtual en móvil (MathLive Issue #2927)
// Causa real: el toolbar usa 'click' y el menú usa la Popover API (showPopover).
// En móvil, la secuencia de eventos táctiles genera un pointerdown de compatibilidad
// DESPUÉS del click, lo que activa el light-dismiss automático del Popover API
// y cierra el menú inmediatamente.
// Solución: interceptar el click en el toolbar antes de que llegue a MathLive
// y re-despacharlo en el siguiente frame de animación, cuando ya no hay
// eventos de toque pendientes.
if ('ontouchstart' in window) {
    const clicksNuestros = new WeakSet();

    document.addEventListener('click', (e) => {
        // Dejar pasar los clicks que nosotros mismos re-despachamos
        if (clicksNuestros.has(e)) return;

        // composedPath() permite ver dentro del shadow DOM
        const path = e.composedPath();

        // ¿El click ocurrió dentro del teclado virtual?
        const enVK = path.some(el =>
            el.tagName === 'MATH-VIRTUAL-KEYBOARD' ||
            el.classList?.contains('MLK__keyboard')
        );
        if (!enVK) return;

        // ¿Fue en el toolbar? (El toolbar tiene role="toolbar" según el código fuente)
        const enToolbar = path.some(el =>
            el.getAttribute?.('role') === 'toolbar' ||
            el.classList?.contains('MLK__toolbar') ||
            el.classList?.contains('MLK__menu')
        );
        if (!enToolbar) return;

        // Encontrar el botón exacto que recibió el click
        const btn = path.find(el => el.tagName === 'BUTTON');
        if (!btn) return;

        // Bloquar el click original completamente
        e.stopImmediatePropagation();
        e.preventDefault();

        // Re-despachar en el siguiente frame: en ese momento ya no hay
        // eventos de toque pendientes y el Popover API no cerrará el menú
        requestAnimationFrame(() => {
            const nuevoClick = new MouseEvent('click', {
                bubbles: true, cancelable: true, composed: true,
                clientX: e.clientX, clientY: e.clientY,
            });
            clicksNuestros.add(nuevoClick);
            btn.dispatchEvent(nuevoClick);
        });

    }, { capture: true }); // capture: true para interceptar antes que MathLive
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = [];

Promise.allSettled([
    'audioaldeano/0.mp3',
    'audioaldeano/1.mp3',
    'audioaldeano/2.mp3',
    'audioaldeano/3.mp3',
    'audioaldeano/4.mp3',
    'audioaldeano/5.mp3.mp3',
    'audioaldeano/6.mp3.mp3',
    'audioaldeano/7.mp3',
].map(src =>
    fetch(src)
        .then(r => r.arrayBuffer())
        .then(buf => audioCtx.decodeAudioData(buf))
)).then(results => {
    results.forEach(r => { if (r.status === 'fulfilled') audioBuffers.push(r.value); });
});

function playAldeano() {
    if (audioBuffers.length === 0) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffers[Math.floor(Math.random() * audioBuffers.length)];
    source.connect(audioCtx.destination);
    source.start();
}

let justKeystroke = false;

mf.addEventListener('keystroke', () => {
    justKeystroke = true;
    playAldeano();
    setTimeout(() => { justKeystroke = false; }, 16);
});

mf.addEventListener('input', () => {
    outputLatex.textContent = mf.value;
    if (!justKeystroke) playAldeano();
});
