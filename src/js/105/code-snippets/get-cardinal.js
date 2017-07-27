export default
`session.open().then(function(global) {
    // Use the Global instance to open our model
    return global.openDoc("sample-model");
})
.then(function(app) {
	// Enigma returns an App instance. Use it to get a Field instance
    return app.getField("Dim1")
})
.then(function(field) {
    // Enigma returns a Field instance. Use it to get the number of distinct values
    return field.getCardinal();
})
.then(function(cardinal) {
    // Do something with the result
    console.log("The field has " + cardinal + " values.");
});`