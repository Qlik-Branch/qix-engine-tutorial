export default
`// A promise for an App instance
var appPr = session.open().then(function(global) {
    return global.openDoc("952656cf-a3f5-42bc-bdad-9d2478031747");
})

// Create the Region listbox with the App instance
appPr.then(function(app) {
    return app.createSessionObject(regionListDef);
})
.then(function(regionLB) {

    var regionList = document.querySelector("#region");

    regionLB.getLayout().then(function(layout) {
        renderFilter(regionList,layout, regionLB);
    });

    regionLB.on("changed", function() {
        regionLB.getLayout().then(function(layout) {
            renderFilter(regionList, layout, regionLB);
        });
    });
});`