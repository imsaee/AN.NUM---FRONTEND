const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-5, 10, 5, -10],
    axis: true,
    showCopyright: false,
    zoom: {
        enabled: true,
        wheel: true,
        needShift: false,
    },
    pan: {
        enabled: true,
        needShift: false,
        needTwoFingers: false,
    },
});

board.create('functiongraph', [x => x ** 3], {
    strokeColor: '#6B8E23',
    strokeWidth: 2,
});
