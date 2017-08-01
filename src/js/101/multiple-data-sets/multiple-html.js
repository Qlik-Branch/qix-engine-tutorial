import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

import paintListContainer from '../paint-list-container.js';

export default function(sectionClass){
  // ========== Config ==========
  const config = {
    lists: {
      radius: 48.6,
      department: {
        x: 425,
        y: 95
      },
      item: {
        x: 425,
        y: 259
      },
      day: {
        x: 350,
        y: 408
      },
      sales: {
        x: 500,
        y: 408
      }
    }
  }


  // ========== New Widths ==========
  // Set left and right bodies to new widths
  d3.select(sectionClass +' .body-left')
    .classed('col-xs-6 col-sm-6 col-md-6 col-lg-6', false)
    .classed('col-xs-5 col-sm-5 col-md-5 col-lg-5', true);

  d3.select(sectionClass +' .body-right')
    .classed('col-xs-6 col-sm-6 col-md-6 col-lg-6', false)
    .classed('col-xs-7 col-sm-7 col-md-7 col-lg-7', true);

  d3.select(sectionClass +' .row')
    .classed('row-5-12', true);


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

  const d3Paragraphs = d3.selectAll(sectionClass +' .body-left > div');

  // Get .graph
  const d3Graph = d3.select(sectionClass +' .graph');


  // ========== Tables ==========
  const dimensionTableContainer = d3Graph
    .append('div');
  
  const dimensionTable = dimensionTableContainer
      .attr('class', 'table-container dim-table')
    .append('table');

  const factTableContainer = d3Graph
    .append('div');

  const factTable = factTableContainer
      .attr('class', 'table-container fact-table')
      .style('opacity', 0)
    .append('table');

  const dimensionTableHeader = dimensionTable.append('thead');
  const dimensionTableBody = dimensionTable.append('tbody');

  const factTableHeader = factTable.append('thead');
  const factTableBody = factTable.append('tbody');


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
      .attr('transform', 'rotate(-160)scale(-1, 1)');

  // Bottom Right Connector
  const curvePathBottomRight = svg
    .append('g')
      .attr('class', 'connector-line bottom right')
      .attr('transform', `translate(${config.lists.sales.x}, ${config.lists.sales.y})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'rotate(160)');

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
  

  // ========== List Groups ==========
  // Department List
  const departmentList = svg
    .append('g')
    .attr('class', 'department-list list')
    .attr('transform', `translate(${config.lists.department.x}, ${config.lists.department.y})`);
  paintListContainer(departmentList, [1], config.lists.radius);

  const departmentLabel = departmentList
    .append('text')
    .attr('class', 'list-label department')
    .text('Department')
    .attr('transform', `translate(0, ${-config.lists.radius*1.5})`);

  // Item List
  const itemList = svg
    .append('g')
    .attr('class', 'item-list list')
    .attr('transform', `translate(${config.lists.item.x}, ${config.lists.item.y})`);
  paintListContainer(itemList, [1], config.lists.radius);

  const itemLabel = itemList
    .append('text')
    .attr('class', 'list-label item')
    .text('Item')
    .attr('transform', `translate(0, ${-config.lists.radius*1.2})`);

  // Day List
  const dayList = svg
    .append('g')
    .attr('class', 'list day-list')
    .attr('transform', `translate(${config.lists.day.x}, ${config.lists.day.y})`);
  paintListContainer(dayList, [1], config.lists.radius);

  const dayLabel = dayList
    .append('text')
    .attr('class', 'list-label day')
    .text('Day')
    .attr('transform', `translate(0, ${-config.lists.radius*1.5})`);

  // Sales List
  const salesList = svg
    .append('g')
    .attr('class', 'list sales-list')
    .attr('transform', `translate(${config.lists.sales.x}, ${config.lists.sales.y})`);
  paintListContainer(salesList, [1], config.lists.radius);

  const salesLabel = salesList
    .append('text')
    .attr('class', 'list-label sales')
    .text('Sales')
    .attr('transform', `translate(0, ${-config.lists.radius*1.5})`);


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
    lists: {
      department: departmentList,
      item: itemList,
      day: dayList,
      sales: salesList
    }
  }
}