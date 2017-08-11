import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

export default function(sectionClass){
  // ========== Left Pane Elements ==========
  // Get all left pane elements
  var subtractor = 0;
  const d3LeftPaneElements = d3.selectAll(sectionClass +' .body-left > *');

  // Add element grouping attribute
  d3LeftPaneElements
    .attr('element-group', (d, i) =>{
      if(['h2', 'h3'].indexOf(d3LeftPaneElements._groups[0][i].localName) != -1){
        return i - subtractor++;
      } else if(d3LeftPaneElements._groups[0][i].localName === 'ul'){
        return i - ++subtractor;
      } 
      else return i - subtractor;
    });
  
  // Group elemnts into divs
  const elementBodyLeft = document.querySelector(sectionClass +' .body-left');

  var currentElementGroup = -1;
  var divGroups = [];

  // For each element..
  d3LeftPaneElements._groups[0].forEach(element =>{
    // if new element group..
    if(+element.getAttribute('element-group') != currentElementGroup){
      // Create div and append element to it
      const div = document.createElement('div');
      div.setAttribute('element-group', +element.getAttribute('element-group'));
      div.appendChild(element);

      // Push to div array
      divGroups.push(div);
        
      currentElementGroup = +element.getAttribute('element-group');
    } else{
      // else, append to most recent div in array
      divGroups[divGroups.length - 1].appendChild(element);
    }
  });

  // Append each div to .body-left
  divGroups.forEach(div =>{
    elementBodyLeft.appendChild(div);
  });

  // Get all paragraph divs
  const d3Paragraphs = d3.selectAll(sectionClass +' .body-left > div');

  // Get .graph
  const d3Graph = d3.select(sectionClass +' .graph');
  
  
  // ========== Scroll Graph ==========
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass +' .row'))
      .graph(d3.select(sectionClass +' .body-right'))
      .sections(d3.selectAll(sectionClass +' .body-left > div'))
  });
  

  // ========== Table ==========
  // Table
  const tableContainer = d3Graph
    .append('div')
    .classed('table-container table stage-0', true);

  const table = tableContainer.append('table');
  const tableHeader = table.append('thead');
  const tableBody = table.append('tbody');

  // Filtered Table
  const filteredTableContainer = d3Graph
    .append('div')
    .classed('table-container filtered-table stage-2', true);

  const filteredTable = filteredTableContainer
    .append('table');
  const filteredTableHeader = filteredTable.append('thead');
  const filteredTableBody = filteredTable.append('tbody');


  // ========== SVG ==========
  const svg = d3Graph
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');


  // ========== Full Circle ==========
  const fillScale = d3.scaleLinear()
    .domain([0, 4])
    .range([310, 190]);

  // Clip path
  const clipPath = svg
    .append('defs')
    .append('clipPath')
      .attr('id', 'rect-clip');

  // Circle fill
  const circleFill = svg.append('circle')
    .attr('class', 'state-circle stage-1')
    .attr('cx', 100)
    .attr('cy', 250)
    .attr('r', 60)
    .attr('clip-path', 'url(#rect-clip)');

  // Draw Rect
  const rectFull = clipPath
    .append('rect')
    .attr('class', 'rect-full stage-1')
    .attr('x', 40)
    .attr('y', fillScale(4))
    .attr('width', 120)
    .attr('height', fillScale(0) - fillScale(4));


  // ========== Full Text ==========
  // Circle Text Data
  var stateCircleText = [
    {text: 'Current State', y: 250},
    {text: '4 records', y: 270}
  ];

  // Update State Circle Text Full
  updateStateCircleTextFull(stateCircleText);
  function updateStateCircleTextFull(data){
    const update = svg.selectAll('.state-circle-text.full')
      .data(data, d => d.text);

    update.enter()
        .append('text')
        .text(d => d.text)
        .attr('class', 'state-circle-text full stage-1')
        .attr('x', 100)
        .attr('y', d => d.y)
        .attr('clip-path', 'url(#rect-clip)')
      .merge(update)
        .text(d => d.text);
  }


  // ========== Filtered Circle ==========
  // Clip path
  const filteredClipPath = svg
    .append('defs')
    .append('clipPath')
      .attr('id', 'filtered-rect-clip');

  // Circle fill
  const circleFiltered = svg.append('circle')
    .attr('class', 'filtered-circle stage-3')
    .attr('cx', '75%')
    .attr('cy', 250)
    .attr('r', 60)
    .attr('clip-path', 'url(#filtered-rect-clip)');

  // Draw Rect
  const rectFiltered = filteredClipPath
    .append('rect')
    .attr('class', 'rect-filtered stage-3')
    // .attr('x', '67%')
    .attr('y', fillScale(1))
    .attr('width', 120)
    .attr('height', fillScale(0) - fillScale(1));

  // Circle outline
  svg.append('circle')
    .attr('class', 'state-circle-outline stage-3')
    .attr('cx', '75%')
    .attr('cy', 250)
    .attr('r', 60);


  // ========== Filtered Text ==========
  // Circle Text Data
  var stateCircleText = [
    {text: 'Current State', y: 250},
    {text: '1 of 4 records', y: 270}
  ];

  // Update State Circle Text Empty
  updateStateCircleTextEmpty(stateCircleText);
  function updateStateCircleTextEmpty(data){
    const update = svg.selectAll('.state-circle-text.empty')
      .data(data, d => d.text);

    update.enter()
        .append('text')
        .text(d => d.text)
        .attr('class', 'state-circle-text empty stage-3')
        .attr('x', '75%')
        .attr('y', d => d.y)
      .merge(update)
        .text(d => d.text);
  }


  // ========== Label Text ==========
  const labelText = svg.append('text')
    .classed('label-text stage-3', true)
    .text('Filter to Electronics')
    .attr('y', 230)


  // ========== Arrow ==========
  // Arrow Head
  svg.append("svg:defs")
    .append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("orient", "auto")
    .append("path")
      .classed('arrow-head', true)
      .attr('d', 'M 0 0 12 6 0 12');

  // Line
  const arrow = svg.append('line')
    .classed('arrow stage-3', true)
    .attr('y1', 250)
    .attr('y2', 250)
    .attr('marker-end', 'url(#triangle)')


  // ========== Resize ==========
  window.addEventListener('resize', function(){resize()});
  function resize(){
    const circleFullBBox = circleFill.node().getBBox();
    const circleFilteredBBox = circleFiltered.node().getBBox();

    const centerX = (circleFilteredBBox.x + circleFilteredBBox.width/2
      + circleFullBBox.x + circleFullBBox.width/2)/2;
    
    // Filtered Rect
    rectFiltered.attr('x', circleFilteredBBox.x);

    // Label Text
    labelText
      .attr('x', centerX);

    // Arrow
    arrow
      .attr('x1', circleFullBBox.x + circleFullBBox.width + 10)
      .attr('x2', circleFilteredBBox.x - 20);

  } resize();

  return {
    d3Graph: d3Graph,
    table: {
      container: tableContainer,
      header: tableHeader,
      body: tableBody
    },
    filteredTable: {
      container: filteredTableContainer,
      header: filteredTableHeader,
      body: filteredTableBody
    }
  }
}