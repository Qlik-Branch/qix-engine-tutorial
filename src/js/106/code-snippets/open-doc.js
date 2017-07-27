export default
`session.open().then(function(global) {
    return global.openDoc("952656cf-a3f5-42bc-bdad-9d2478031747");
}).then(function(app) {
    console.log("Got an App instance", app);
});`