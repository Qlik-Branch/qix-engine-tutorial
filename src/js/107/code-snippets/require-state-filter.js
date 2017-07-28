export default
`// Dependencies
var enigma = require("enigma.js");
var qixSchema = require("enigma.js/schemas/12.20.0.json");

// Definitions
var regionListDef = require("./defs/region-listobject.json");
var stateListDef = require("./defs/state-listobject.json");

// ... etc ... //

// Create the State listbox with the App instance
appPr.then(function(app) {
    return app.createSessionObject(stateListDef);
})
.then(function(stateLB) {

    var stateList = document.querySelector("#state");

    stateLB.getLayout().then(function(layout) {
        renderFilter(stateList,layout, stateLB);
    });

    stateLB.on("changed", function() {
        stateLB.getLayout().then(function(layout) {
            renderFilter(stateList, layout, stateLB);
        });
    });
});`