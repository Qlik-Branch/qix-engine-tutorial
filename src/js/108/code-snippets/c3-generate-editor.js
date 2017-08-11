export default
`c3.generate({
    bindTo: "#chart",
    data: {
        x: "x",
        columns: [
            ['x', "a", "b", "c", "d", "e", "f"],
            ['data1', 30, 200, 100, 400, 150, 250]
        ]
    },
    axis: {
        x: {
            type: 'category'
        }
    }
})`