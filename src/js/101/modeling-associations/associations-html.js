import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

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


  // ========== Tables ==========
  // Dimension Table
  const dimensionTableContainer = d3Graph
    .append('div');
  
  const dataTable = dimensionTableContainer
    .attr('class', 'table-container')
    .append('table');

  const tableHeader = dataTable.append('thead');
  const tableBody = dataTable.append('tbody');
  
  
  // ========== Scroll Graph ==========
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass +' .row'))
      .graph(d3.select(sectionClass +' .body-right'))
      .sections(d3.selectAll(sectionClass +' .body-left > div'))
  });


  // ========== SVG ==========
  const svg = d3Graph
    .append('svg')
    .attr('width', '100%');


  // ========== Rect ==========
  const rect = svg
    .append('rect')
    .attr('class', 'connector-rect')
    .attr('x', config.lists.department.x - config.lists.radius)
    .attr('y', config.lists.department.y)
    .attr('width', config.lists.radius*2)
    .attr('height', config.lists.item.y - config.lists.department.y)
    .style('opacity', 0);

  
  // ========== Connection Parabolas ==========
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

  // Get PathData
  const pathData = lineGenerator(parabolaPoints);

  // Left Connector
  const curvePathLeft = svg
    .append('g')
      .attr('class', 'connector-line left')
      .attr('transform', `translate(${departmentCircleLeftEdge}, ${config.lists.department.y})`)
    .append('path')
      .attr('d', pathData);

  // Right Connector
  const curvePathRight = svg
    .append('g')
      .attr('class', 'connector-line right')
      .attr('transform', `translate(${departmentCircleRightEdge}, ${config.lists.department.y})`)
    .append('path')
      .attr('d', pathData)
      .attr('transform', 'scale(-1, 1)');


  // ========== Arrows ==========
  const arrowBase = svg
    .append('circle')
    .attr('class', 'arrow base')
    .attr('cx', config.lists.department.x)
    .attr('cy', (config.lists.item.y + config.lists.department.y)/2)
    .attr('r', 4)
    .style('opacity', 0);

  const arrow = svg
    .append('line')
    .attr('class', 'arrow')
    .attr('x1', config.lists.department.x - 4)
    .attr('y1', (config.lists.item.y + config.lists.department.y)/2)
    .attr('x2', config.lists.department.x - 4)
    .attr('y2', (config.lists.item.y + config.lists.department.y)/2)


  // ========== List Groups ==========
  const departmentList = svg
    .append('g')
    .attr('class', 'department-list')
    .attr('transform', `translate(${config.lists.department.x}, ${config.lists.department.y})`);

  const itemList = svg
    .append('g')
    .attr('class', 'item-list')
    .attr('transform', `translate(${config.lists.item.x}, ${config.lists.item.y})`);




  return {
    d3Paragraphs: d3Paragraphs,
    dimensionTable: {
      container: dimensionTableContainer,
      header: tableHeader,
      body: tableBody
    },
    lists: {
      department: departmentList,
      item: itemList
    },
    rect: rect,
    arrow: {
      line: arrow,
      base: arrowBase
    },
    config: config
  }
}