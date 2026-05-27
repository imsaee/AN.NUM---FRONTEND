const mf = document.getElementById('ent-func');
const outputLatex = document.getElementById('output-latex');

mf.virtualKeyboardMode = 'onfocus';
mf.keypressSound = null;
if (window.mathVirtualKeyboard) {
    window.mathVirtualKeyboard.keypressSound = null;
}


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = [];

Promise.allSettled([
    'audioaldeano/0.mp3',
    'audioaldeano/1.mp3',
    'audioaldeano/2.mp3',
    'audioaldeano/3.mp3',
    'audioaldeano/4.mp3',
    'audioaldeano/5.mp3',
    'audioaldeano/6.mp3',
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
