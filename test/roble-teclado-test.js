const mf = document.getElementById('ent-func');
const outputLatex = document.getElementById('output-latex');

mf.virtualKeyboardMode = 'onfocus';
mf.keypressSound = null;
if (window.mathVirtualKeyboard) {
    window.mathVirtualKeyboard.keypressSound = null;
}

// Fix: menú desplegable del teclado virtual en móvil (MathLive Issue #2927)
// Causa: los botones del toolbar usan 'pointerdown' en vez de 'click'.
// En táctil el browser genera un click sintético que cierra el menú inmediatamente.
// Solución: interceptar touchstart/touchend en el toolbar y re-despachar los
// eventos de forma controlada para que el dropdown pueda abrirse y quedarse abierto.
if (window.matchMedia('(pointer: coarse)').matches) {
    // Selectores para el botón de menú/toolbar (varios para cubrir distintas versiones de MathLive)
    const TOOLBAR_SEL = [
        '.MLK__toolbar button',
        '.MLK__menu button',
        '[part~="toolbar"] button',
        '[part~="menu"] button',
        'button[aria-haspopup]',
    ].join(',');

    function aplicarFixTeclado(root) {
        // 1. Inyectar touch-action en el shadow DOM para eliminar el delay táctil de 300ms
        const css = document.createElement('style');
        css.textContent = 'button,[role="button"]{touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}';
        root.insertBefore(css, root.firstChild);

        // 2. En touchstart: bloquear el click sintético que genera el browser
        root.addEventListener('touchstart', (e) => {
            if (e.target.closest(TOOLBAR_SEL)) e.preventDefault();
        }, { passive: false, capture: true });

        // 3. En touchend: disparar manualmente pointerdown → pointerup → click
        //    para que MathLive procese la acción en el momento correcto (al soltar)
        root.addEventListener('touchend', (e) => {
            const btn = e.target.closest(TOOLBAR_SEL);
            if (!btn) return;
            e.preventDefault();
            const opts = { bubbles: true, cancelable: true, pointerType: 'mouse', isPrimary: true };
            btn.dispatchEvent(new PointerEvent('pointerdown', opts));
            btn.dispatchEvent(new PointerEvent('pointerup',   opts));
            btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }, { passive: false, capture: true });
    }

    // Esperar a que el elemento del teclado aparezca en el DOM
    const vkObs = new MutationObserver(() => {
        const vkEl = document.querySelector('math-virtual-keyboard')
                  ?? document.querySelector('.MLK__keyboard');
        if (!vkEl) return;
        vkObs.disconnect();
        aplicarFixTeclado(vkEl.shadowRoot ?? vkEl);
    });
    vkObs.observe(document.body, { childList: true });
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
