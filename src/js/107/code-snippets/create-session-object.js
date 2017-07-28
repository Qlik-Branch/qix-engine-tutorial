export default
`// Dependencies
var enigma = require("enigma.js");
var qixSchema = require("enigma.js/schemas/12.20.0.json");

// Definitions
var regionListDef = require("./defs/region-listobject.json");

var config = {
    schema: qixSchema,
    url: "ws://qs-sk/app/"
};

var session = enigma.create(config);

// A promise for an App instance
var appPr = session.open().then(function(global) {
    return global.openDoc("df71b5c0-016b-49c3-bf37-0a4f44eea162");
})

// Create the Region listbox with the App instance
appPr.then(function(app) {
    return app.createSessionObject(regionListDef);
})
.then(function(regionLB) {
    console.log("Generic Object for Region filter", regionLB);
});`