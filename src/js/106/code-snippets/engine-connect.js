export default
`var enigma = require("enigma.js");
var qixSchema = require("enigma.js/schemas/12.20.0.json");

var config = {
    schema: qixSchema,
    url: "wss://playground.qlik.com/app/"
};

var session = enigma.create(config);

session.open().then(function(global) {
    // do something with the Global instance
});`