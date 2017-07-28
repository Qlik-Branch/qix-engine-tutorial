export default
`// A promise for an App instance
var appPr = session.open().then(function(global) {
    return global.openDoc("df71b5c0-016b-49c3-bf37-0a4f44eea162");
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