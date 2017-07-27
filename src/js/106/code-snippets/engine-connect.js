export default
`var enigma = require("enigma.js");
var qixSchema = require("enigma.js/schemas/qix/12.20.0/schema.json");

var config = {
    schema: qixSchema,
    url: "url goes here"
};

var session = enigma.create(config);

session.open().then(function(global) {
    // do something with the Global instance
});`