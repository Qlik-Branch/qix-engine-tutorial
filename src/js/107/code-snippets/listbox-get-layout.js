export default
`// Create the Region listbox with the App instance
appPr.then(function(app) {
    return app.createSessionObject(regionListDef);
})
.then(function(regionLB) {
    regionLB.getLayout().then(function(layout) {
        // do something with the layout
        console.log(layout);
    });
});`