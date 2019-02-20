export default 
`// Create the websocket connection
var conn = new WebSocket("wss://playground-sense.qlik.com/app/");

// Wait for the websocket connection to be established, and then make and listen for calls
conn.onopen = function() {
    // Define the API call
    var apiCall = {
        "id": 1,
        "jsonrpc":"2.0",
        "handle":-1,
        "method":"EngineVersion",
        "params":[]
    };

    // Send the API call as a string
    conn.send(JSON.stringify(apiCall));
}

// Listen for the API call with id 1
conn.onmessage = function(evt) {
    // Parse the response into JSON
    var response = JSON.parse(evt.data);
    
    // Check to see if the response is for the API call with id 1
    if(response.id === 1) {
        // If so, get the version
        var engineVersion = response.result.qVersion.qComponentVersion;
    }
}
`