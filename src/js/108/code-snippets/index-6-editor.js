export default
`// Create the chart hypercube with the App instance
appPr.then(function(app) {
    return app.createSessionObject(chartDef);
})
.then(function(chartObj) {

    chartObj.getLayout().then(function(layout) {
        renderChart(layout);
    });

    chartObj.on("changed", function() {
        chartObj.getLayout().then(function(layout) {
            renderChart(layout);
        });
    });

})`