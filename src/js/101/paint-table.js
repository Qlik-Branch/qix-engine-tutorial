export default function(table, data, selectionTransition){
  const tableHeader = table.header;
  const tableBody = table.body;
  const headerData = data.headerData;
  const bodyData = data.bodyData;

  // Create table header row and cells
  tableHeader.selectAll('tr')
      .data([headerData])
      .enter()
      .append('tr')
    .selectAll('td')
      .data(d => d)
      .enter()
      .append('th')
      .html(d => d.qText);


  // ------------ Table Body ------------
  // Attach data to table
  const rowUpdate = tableBody.selectAll('tr')
    .data(bodyData, d => d[0].qText +'|' +d[1].qText);

  
  // Enter new data
  const rowEnter = rowUpdate
    .enter()
    .append('tr')
    .style('color', 'black');

  rowUpdate
    .transition()
    .duration(selectionTransition)
    .style('color', 'black');


  // Any rows that don't exist shade grey
  rowUpdate.exit()
    .transition()
    .duration(selectionTransition)
    .style('color', '#aaa');


  // Add cells to all rows
  rowEnter.selectAll('td')
    .data(d => d)
    .enter()
    .append('td')
    .html(d => d.qText)
}