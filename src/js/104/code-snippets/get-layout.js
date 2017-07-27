export default
`conn.onmessage = function(evt) {
    // Parse the response into JSON
    var response = JSON.parse(evt.data);
    
    // Check to see if the response has changes
    if(response.hasOwnProperty("change")) {
        // do something with the changes
        console.log(response.change);
    }
}`