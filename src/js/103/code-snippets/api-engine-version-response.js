export default 
`// Listen for the API call with id 1
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