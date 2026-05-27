let myChart = null;

document.getElementById('btn-graficar').addEventListener('click', graficar);

function graficar() {
    const funcStr = document.getElementById('ent-func').value;
    const xMin = parseFloat(document.getElementById('ent-xmin').value);
    const xMax = parseFloat(document.getElementById('ent-xmax').value);

    const dataPoints = [];
    const paso = (xMax - xMin) / 200;

    for (let x = xMin; x <= xMax; x += paso) {
        try {
            dataPoints.push({ x, y: math.evaluate(funcStr, { x }) });
        } catch (e) {}
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `f(x) = ${funcStr}`,
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
                legend: {
                    labels: { color: '#4A4A4A' }
                }
            }
        }
    });
}
