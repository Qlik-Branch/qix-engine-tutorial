import * as d3 from 'd3';

export default function(tableHeader, headerData, tableBody, bodyData){
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
    .merge(rowUpdate)
      // Update rows that still exist
      .style('color', 'black');


  // Any rows that don't exist shade grey
  rowUpdate.exit()
    .style('color', '#aaa');


  // Add cells to all rows
  rowEnter.selectAll('td')
    .data(d => d)
    .enter()
    .append('td')
    .html(d => d.qText)
}