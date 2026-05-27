const FUNCION = (x) => x ** 3;
const X_MIN = -5;
const X_MAX = 5;

const dataPoints = [];
const paso = (X_MAX - X_MIN) / 200;
for (let x = X_MIN; x <= X_MAX; x += paso) {
    dataPoints.push({ x, y: FUNCION(x) });
}

const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'f(x) = x³',
            data: dataPoints,
            borderColor: '#6B8E23',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                grid: { color: '#BDBDA0' },
                ticks: { color: '#4A4A4A' },
            },
            y: {
                grid: { color: '#BDBDA0' },
                ticks: { color: '#4A4A4A' },
            }
        },
        plugins: {
            legend: { labels: { color: '#4A4A4A' } }
        }
    }
});
