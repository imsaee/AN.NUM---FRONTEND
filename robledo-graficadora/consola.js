(function () {
    const pre = document.createElement('pre');
    pre.id = 'consola';
    pre.textContent = 'Esperando cálculos...\n';
    document.body.appendChild(pre);

    function log(tipo, args) {
        const linea = `[${tipo}] ${Array.from(args).join(' ')}\n`;
        pre.textContent += linea;
        pre.scrollTop = pre.scrollHeight;
    }

    const _log   = console.log.bind(console);
    const _warn  = console.warn.bind(console);
    const _error = console.error.bind(console);

    console.log   = function () { _log(...arguments);   log('LOG',   arguments); };
    console.warn  = function () { _warn(...arguments);  log('WARN',  arguments); };
    console.error = function () { _error(...arguments); log('ERROR', arguments); };

    window.onerror = function (msg, src, line, col, err) {
        log('UNCAUGHT', [err ? err.message : msg]);
        return false;
    };

    window.onunhandledrejection = function (e) {
        log('PROMISE', [e.reason]);
    };

    // Observa el div de resultado para capturar errores y éxitos de script.js
    document.addEventListener('DOMContentLoaded', function () {
        const raizEl  = document.getElementById('res-raiz');
        const iterEl  = document.getElementById('res-iter');
        const errorEl = document.getElementById('res-error');

        if (!raizEl) return;

        const observer = new MutationObserver(function () {
            const raiz  = raizEl.textContent;
            const iter  = iterEl  ? iterEl.textContent  : '---';
            const error = errorEl ? errorEl.textContent : '---';

            if (raiz === '---') return;

            const ts = new Date().toLocaleTimeString();

            if (raiz === 'ERROR') {
                pre.textContent += `[${ts}] ERROR → ${error}\n`;
            } else {
                const metodo = document.querySelector('input[name="metodo"]:checked');
                const nombre = metodo ? metodo.value : '?';
                pre.textContent += `[${ts}] OK (${nombre}) → raíz: ${raiz} | iter: ${iter} | err: ${error}\n`;
            }

            pre.scrollTop = pre.scrollHeight;
        });

        observer.observe(raizEl, { childList: true, subtree: true, characterData: true });
    });
})();
