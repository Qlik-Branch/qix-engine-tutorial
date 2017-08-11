import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

import paintListContainer from '../paint-list-container.js';

export default function(sectionClass){
  // ========== Config ==========
  const config = {
    lists: {
      radius: 48.6,
      department: {
        x: 500,
        y: 95
      },
      item: {
        x: 500,
        y: 259
      },
      day: {
        x: 400,
        y: 408
      },
      sales: {
        x: 600,
        y: 408
      }
    }
  }


  // ========== New Widths ==========
  window.addEventListener('load', function(){onload()});
  function onload(){
    // Set left and right bodies to new widths
    d3.select(sectionClass +' .body-left')
      .classed('col-xs-6 col-sm-6 col-md-6 col-lg-6', false)

    d3.select(sectionClass +' .body-right')
      .classed('col-xs-6 col-sm-6 col-md-6 col-lg-6', false)

    d3.select(sectionClass +' .row')
      .classed('overlap-graph-scroll', true)
  }


  // ========== Left Pane Elements ==========
  // Get all left pane elements
  var subtractor = 0;
  const d3LeftPaneElements = d3.selectAll(sectionClass +' .body-left > *');

  // Add element grouping attribute
  d3LeftPaneElements
    .attr('element-group', (d, i) =>{
      if(d3LeftPaneElements._groups[0][i].localName === 'h3'){
        return i - subtractor++;
      } else if(d3LeftPaneElements._groups[0][i].localName === 'ul'){
        return i - ++subtractor;
      } 
      else return i - subtractor;
    });

  // Group elements into divs
  const elementBodyLeft = document.querySelector(sectionClass +' .body-left');

  var currentElementGroup = -1;
  var divGroups = [];

  // For each element..
  d3LeftPaneElements._groups[0].forEach(element =>{
    // if new element group..
    if(+element.getAttribute('element-group') != currentElementGroup){
      // create div and append element to it
      const div = document.createElement('div');
      div.setAttribute('element-group', +element.getAttribute('element-group'));
      div.appendChild(element);

      // push to div array
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


  // ========== Tables ==========
  // Dimension Table
  const dimensionTableContainer = d3Graph
    .append('div');
  
  const dimensionTable = dimensionTableContainer
    .attr('class', 'table-container dim-table')
    .append('table');

  // Fact Table
  const factTableContainer = d3Graph
    .append('div');

  const factTable = factTableContainer
      .attr('class', 'table-container fact-table')
      .style('opacity', 0)
    .append('table');

  // Sum Table
  const sumTableContainer = d3Graph
    .append('div')
    .style('left', (config.lists.item.x + 125) +'px');

  const sumTable = sumTableContainer
      .attr('class', 'table-container sum-table')
      .style('opacity', 0)
    .append('table');

  // Table Headers, Bodies
  const dimensionTableHeader = dimensionTable.append('thead');
  const dimensionTableBody = dimensionTable.append('tbody');

  const factTableHeader = factTable.append('thead');
  const factTableBody = factTable.append('tbody');

  const sumTableHeader = sumTable.append('thead');
  const sumTableBody = sumTable.append('tbody');


  // ========== Scroll Graph ==========
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass +' .row'))
      .graph(d3.select(sectionClass +' .body-right'))
      .sections(d3.selectAll(sectionClass +' .body-left > div'));
  });


  // ========== SVG ==========
  const svg = d3Graph
    .append('svg')
    .attr('width', '100%');

  // ========== Rect ==========
  // Top Rectangle
  const topRect = svg
    .append('rect')
    .attr('class', 'connector-rect top')
    .attr('x', config.lists.department.x - config.lists.radius)
    .attr('y', config.lists.department.y)
    .attr('width', config.lists.radius*2)
    .attr('height', config.lists.item.y - config.lists.department.y);

  // Bottom Rectangle
  const bottomRect = svg
    .append('polygon')
    .attr('class', 'connector-rect bottom')
    .attr('points', 
      `${config.lists.item.x},${config.lists.item.y},
        ${config.lists.sales.x},${config.lists.sales.y},
        ${config.lists.day.x},${config.lists.day.y}`);


  // ========== Connection Parabolas ==========
  // Top Connector Lines
  const lineGenerator = d3.line()
    .curve(d3.curveCardinal);

  // Define connector points
  const departmentCircleLeftEdge = config.lists.department.x - config.lists.radius,
    departmentCircleRightEdge = config.lists.department.x + config.lists.radius,
    connectorIndent = 30,
    connectorVerticalSpacing = 55,
    baseLength = config.lists.item.y - config.lists.department.y,
    parabolaPoints = [
      [0, 0],
      [connectorIndent, connectorVerticalSpacing],
      [connectorIndent, baseLength - connectorVerticalSpacing],
      [0, baseLength]
    ];

  // get pathData
  const pathData = lineGenerator(parabolaPoints);

  // Top Left Connector
  const curvePathTopLeft = svg
    .append('g')
      .attr('class', 'connector-line top left')
      .attr('transform', `translate(${departmentCircleLeftEdge}, ${config.lists.department.y})`)
    .append('path')
      .attr('d', pathData);

  // Top Right Connector
  const curvePathTopRight = svg
    .append('g')
      .attr('class', 'connector-line top right')
      .attr('transform', `translate(${departmentCircleRightEdge}, ${config.lists.department.y})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'scale(-1, 1)');

  // Bottom Left Connector
  const curvePathBottomLeft = svg
    .append('g')
      .attr('class', 'connector-line bottom left')
      .attr('transform', `translate(${config.lists.day.x}, ${config.lists.day.y})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'rotate(-150)scale(-1, 1)');

  // Bottom Right Connector
  const curvePathBottomRight = svg
    .append('g')
      .attr('class', 'connector-line bottom right')
      .attr('transform', `translate(${config.lists.sales.x}, ${config.lists.sales.y})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'rotate(150)');

  // Bottom Bottom Connector
  const bottomBottomXPos = config.lists.day.x
    - (baseLength 
      - (config.lists.sales.x - config.lists.day.x)
    )/2;
  const curvePathBottomBottom = svg
    .append('g')
      .attr('class', 'connector-line bottom')
      .attr('transform', `translate(${bottomBottomXPos}, ${config.lists.day.y + connectorIndent/2})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'rotate(-90)')


  // ========== Arrows ==========
  const topArrowBase = svg
    .append('circle')
    .attr('class', 'arrow top base')
    .attr('cx', config.lists.department.x)
    .attr('cy', (config.lists.item.y + config.lists.department.y)/2)
    .attr('r', 4);

  const topArrow = svg
    .append('line')
    .attr('class', 'arrow top')
    .attr('x1', config.lists.department.x - 4)
    .attr('y1', (config.lists.item.y + config.lists.department.y)/2)
    .attr('x2', 273)
    .attr('y2', (config.lists.item.y + config.lists.department.y)/2);

  const bottomArrowBase = svg
    .append('circle')
    .attr('class', 'arrow bottom base')
    .attr('cx', config.lists.item.x)
    .attr('cy', (config.lists.day.y + config.lists.item.y)*.525)
    .attr('r', 4);

  const bottomArrow = svg
    .append('line')
    .attr('class', 'arrow bottom')
    .attr('x1', config.lists.item.x - 4)
    .attr('y1', (config.lists.day.y + config.lists.item.y)*.525)
    .attr('x2', config.lists.item.x - 4)
    .attr('y2', (config.lists.day.y + config.lists.item.y)*.525);

  // const sumTableArrow = svg
  //   .append('line')
  //   .attr('class', 'arrow arrow-sum-table')
  //   .attr('x1', config.lists.item.x)
  //   .attr('y1', config.lists.department.y)
  //   .attr('x2', config.lists.item.x)
  //   .attr('y2', config.lists.department.y)

  // ========== List Groups ==========
  // Department List
  const departmentList = svg
    .append('g')
    .attr('class', 'department-list list')
    .attr('transform', `translate(${config.lists.department.x}, ${config.lists.department.y})`);
  paintListContainer(departmentList, [1], config.lists.radius, 'Department', 1.5);

  // Item List
  const itemList = svg
    .append('g')
    .attr('class', 'item-list list')
    .attr('transform', `translate(${config.lists.item.x}, ${config.lists.item.y})`);
  paintListContainer(itemList, [1], config.lists.radius, 'Item', 1.25);

  // Day List
  const dayList = svg
    .append('g')
    .attr('class', 'list day-list')
    .attr('transform', `translate(${config.lists.day.x}, ${config.lists.day.y})`);

  // Sales List
  const salesList = svg
    .append('g')
    .attr('class', 'list sales-list')
    .attr('transform', `translate(${config.lists.sales.x}, ${config.lists.sales.y})`);


  // ========== Sum ==========
  // Label
  const sumLabel = d3Graph.append('div')
    .attr('class', 'sum-label')
    .style('left', (config.lists.item.x + config.lists.radius*1.6) +'px')
    .style('top', config.lists.item.y +'px')
    .html('Calculate Sum of Sales')
    .style('opacity', 0);

  // Static Line
  const sumStaticLine = svg.append('line')
    .attr('class' , 'sum-line static')
    .attr('x1', config.lists.item.x + config.lists.radius*2)
    .attr('y1', config.lists.item.y)
    .attr('x2', config.lists.item.x + config.lists.radius*2)
    .attr('y2', config.lists.sales.y - config.lists.radius*1.8)
    .style('opacity', 0);

  // Dynamic Line
  const sumDynamicLine = svg.append('line')
    .attr('class', 'sum-line dynamic')
    .attr('x1', config.lists.sales.x + config.lists.radius)
    .attr('y1', config.lists.sales.y)
    .attr('x2', config.lists.sales.x + config.lists.radius)
    .attr('y2', config.lists.sales.y)
    .style('opacity', 0);
    // .attr('y2', config.lists.sales.y + config.lists.radius*2.5)

  // Sum Output
  const sumOutput = d3Graph.append('div')
    .attr('class', 'sum-output')
    .style('left', (config.lists.sales.x + 100) +'px')
    .style('top', config.lists.sales.y +'px')
    .style('opacity', 0);

  sumOutput.append('span')
    .attr('class', 'label')
    .html('Total # of Sales');

  sumOutput.append('br');

  const sumOutputValue = sumOutput.append('span')
    .attr('class', 'value')


  return {
    d3Paragraphs: d3Paragraphs,
    dimensionTable: {
      container: dimensionTableContainer,
      header: dimensionTableHeader,
      body: dimensionTableBody
    },
    factTable: {
      container: factTableContainer,
      header: factTableHeader,
      body: factTableBody
    },
    departmentSalesTable: {
      container: sumTableContainer,
      header: sumTableHeader,
      body: sumTableBody
    },
    lists: {
      department: departmentList,
      item: itemList,
      day: dayList,
      sales: salesList
    },
    rects: {
      top: topRect,
      bottom: bottomRect
    },
    arrows: {
      bottomArrow: bottomArrow,
      bottomArrowBase: bottomArrowBase,
      // sumTableArrow: sumTableArrow
    },
    sum: {
      label: sumLabel,
      staticLine: sumStaticLine,
      dynamicLine: sumDynamicLine,
      output: sumOutput,
      outputValue: sumOutputValue
    },
    config: config
  }
}