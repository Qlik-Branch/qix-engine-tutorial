export default
`session.open().then(function(global) {
    return global.engineVersion();
})
.then(function(engineVersion) {
	// do something with the engine version
	console.log("The engine version is ", engineVersion);
});`