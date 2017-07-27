export default
`session.open(config).then(function(global) {
    // Get the Global instance and open our model
    return global.openDoc("MyModel");
})
.then(function(app) {
	// Enigma returns an App instance. Use it to get a Generic Object instance
    return app.getObject("my-obj-id")
})
.then(function(genericObject) {
	// Enigma returns a Generic Object
});`