export default 
`// Wait for the websocket connection to be established, and then make and listen for calls
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
`