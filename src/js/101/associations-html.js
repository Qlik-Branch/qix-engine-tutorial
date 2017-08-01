import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

export default function(sectionClass, circleRadius){
  // Get all left pane elements
  var subtractor = 0;
  const leftPaneElements = d3.selectAll(sectionClass +' .body-left > *');

  // Add element grouping attribute
  leftPaneElements
    .attr('element-group', (d, i) =>{
      if(leftPaneElements._groups[0][i].localName === 'h3'){
        return i - subtractor++;
      } else if(leftPaneElements._groups[0][i].localName === 'ul'){
        return i - ++subtractor;
      } 
      else return i - subtractor;
    });

  
  // Group elemnts into divs
  const bodyLeft = document.querySelector(sectionClass +' .body-left');

  var currentElementGroup = -1;
  var divElementGroups = [];
  leftPaneElements._groups[0].forEach(element =>{
    if(+element.getAttribute('element-group') != currentElementGroup){
      const div = document.createElement('div');
      div.setAttribute('element-group', +element.getAttribute('element-group'));
      div.appendChild(element);

      divElementGroups.push(div);
        
      currentElementGroup = +element.getAttribute('element-group');
    } else{
      divElementGroups[divElementGroups.length - 1].appendChild(element);
    }
  });

  divElementGroups.forEach(div =>{
    bodyLeft.appendChild(div);
  });

  const elementGroups = d3.selectAll(sectionClass +' .body-left > div');


  // Get modeling-associations graph
  const modelingAssociations = d3.select(sectionClass +' .graph');


  // Create and append table
  const dataTable = modelingAssociations
    .append('div')
      .attr('class', 'table-container')
    .append('table');

  const tableHeader = dataTable.append('thead');
  const tableBody = dataTable.append('tbody');
  
  
  const circleX = 400;
  const departmentListY = 95;
  const itemListY = 259;
  // Create SVG element
  const svg = modelingAssociations
    .append('svg')
    .attr('width', '100%');

  // Rectangle used as background color of connector
  const rect = svg
    .append('rect')
    .attr('class', 'connector-rect')
    .style('opacity', 0)
    .attr('x', circleX - circleRadius)
    .attr('y', departmentListY)
    .attr('width', circleRadius*2)
    .attr('height', itemListY - departmentListY)


  // Line generator to draw connector lines
  const lineGenerator = d3.line()
    .curve(d3.curveCardinal);

  // Connector Lines
  const leftPoints = [
    [circleX - circleRadius, departmentListY],
    [circleX - circleRadius + 30, departmentListY + 55],
    [circleX - circleRadius + 30, itemListY - 55],
    [circleX - circleRadius, itemListY]
  ];

  const rightPoints = [
    [circleX + circleRadius, departmentListY],
    [circleX + circleRadius - 30, departmentListY + 55],
    [circleX + circleRadius - 30, itemListY - 55],
    [circleX + circleRadius, itemListY]
  ];

  const leftPathData = lineGenerator(leftPoints)
  const rightPathData = lineGenerator(rightPoints);

  const curvePathLeft = svg
    .append('path')
    .attr('class', 'connector-line connector-line-left')
    .attr('d', leftPathData)

  const curvePathRight = svg
    .append('path')
    .attr('class', 'connector-line connector-line-right')
    .attr('d', rightPathData)


  // Arrow to table
  const arrowBase = svg
    .append('circle')
    .attr('class', 'arrow arrow-base')
    .attr('cx', circleX)
    .attr('cy', (itemListY + departmentListY)/2)
    .attr('r', 4)
    .style('opacity', 0);

  const arrow = svg
    .append('line')
    .attr('class', 'arrow')
    .attr('x1', circleX - 4)
    .attr('y1', (itemListY + departmentListY)/2)
    .attr('x2', circleX - 4)
    .attr('y2', (itemListY + departmentListY)/2)


  const departmentList = svg
    .append('g')
    .attr('class', 'department-list')
    .attr('transform', 'translate(400, 95)');

  const itemList = svg
    .append('g')
    .attr('class', 'item-list')
    .attr('transform', 'translate(400, 259)');


  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass +' .row'))
      .graph(d3.select(sectionClass +' .body-right'))
      .sections(d3.selectAll(sectionClass +' .body-left > div'))
  });


  return {
    elements: elementGroups,
    tableHeader: tableHeader,
    tableBody: tableBody,
    svg: svg,
    rect: rect,
    arrowBase: arrowBase,
    arrow: arrow,
    departmentList: departmentList,
    itemList: itemList
  }
}