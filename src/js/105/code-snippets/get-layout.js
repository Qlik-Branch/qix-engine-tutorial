export default
`// ...
.then(function(genericObject) {
	// Enigma returns a Generic Object. Listen for changes and get a new layout on each change
	genericObject.on("changed", function() {
		genericObject.getLayout().then(function(layout) {
			// do something with the latest layout, like render
		});
	});
});`