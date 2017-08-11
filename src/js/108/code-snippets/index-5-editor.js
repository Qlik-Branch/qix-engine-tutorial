export default
`function renderChart(layout) {
    var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
    var dimValues = qMatrix.map(function(r) {
        return r[0].qText;
    });
    var measureValues = qMatrix.map(function(r) {
        return r[1].qNum;
    });

    c3.generate({
        bindTo: "#chart",
        data: {
            x: "x",
            columns: [
                ['x'].concat(dimValues),
                ['Avg Price'].concat(measureValues)
            ]
        },
        axis: {
            x: {
                type: 'category'
            },
            y: {
                tick: {
                    format: format('$,')
                }
            }
        }
    });
}`