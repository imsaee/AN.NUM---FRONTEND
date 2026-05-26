const mf = document.getElementById('ent-func');
const outputLatex = document.getElementById('output-latex');

mf.virtualKeyboardMode = 'onfocus';

// Disable MathLive's built-in keypress sounds
mf.keypressSound = null;
if (window.mathVirtualKeyboard) {
    window.mathVirtualKeyboard.keypressSound = null;
}

const sounds = [
    'audioaldeano/0.mp3',
    'audioaldeano/1.mp3',
    'audioaldeano/2.mp3',
    'audioaldeano/3.mp3',
    'audioaldeano/4.mp3',
    'audioaldeano/5.mp3.mp3',
    'audioaldeano/6.mp3.mp3',
    'audioaldeano/7.mp3',
].map(src => {
    const a = new Audio(src);
    a.preload = 'auto';
    return a;
});

function playAldeano() {
    const a = sounds[Math.floor(Math.random() * sounds.length)];
    a.currentTime = 0;
    a.play().catch(() => {});
}

// Para teclado físico: keystroke cubre todas las teclas (incluso flechas)
// Para teclado virtual: input cubre todos los cambios de contenido
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
