import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

export default function(sectionClass){
  // Get all left pane elements
  var subtractor = 0;
  const leftPaneElements = d3.selectAll(sectionClass +' .body-left > *')
    .classed('hidden', true)
    .attr('id', (d, i) => `element-${i}`);

  // Add element grouping attribute
  leftPaneElements
    .attr('element-group', (d, i) =>{
      if(leftPaneElements._groups[0][i].localName === 'h3'){
        return i - subtractor++;
      } else if(leftPaneElements._groups[0][i].localName === 'ul'){
        return i - ++subtractor;
      } 
      // else if(leftPaneElements._groups[0][i].innerHTML.indexOf('<br>') != -1){
      //   return i - subtractor++;
      // } 
      else return i - subtractor;
    });

  // Define scroll height
  const groups = leftPaneElements._groups[0].length - subtractor;
  const scrollHeight = (leftPaneElements._groups[0].length - subtractor)*500;

  // Get section
  const section = d3.select(sectionClass)
      .classed('fixed-transition', true)
      .style('height', `calc(${scrollHeight}px + 100vh)`)
    .select('.row')
      .classed('row-graph', true);


  /* Add an invisible line width 0 width to use as the scrolling section
      in graph-scroll */
  section
    .append('div')
      .classed('scroll-line', true)
      .style('height', 'calc(' +scrollHeight +'px + 100vh)')
    .append('div');

  
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass))
      .graph(d3.select(sectionClass +' .row'))
      .sections(d3.selectAll(sectionClass +' .scroll-line'));
  });


  // Get modeling-associations graph
  const modelingAssociations = d3.select(sectionClass +' .graph');


  // Create and append table
  const dataTable = modelingAssociations
    .append('div')
      .attr('class', 'table-container')
    .append('table');

  const tableHeader = dataTable.append('thead');
  const tableBody = dataTable.append('tbody');
  
  
  // Create SVG element
  const svg = modelingAssociations
    .append('svg')
    .attr('width', '100%');

  const departmentList = svg
    .append('g')
    .attr('class', 'department-list');
  
  // const departmentListCircle = departmentList
  //   .append('circle')
  //   .attr('class', 'circle-container')
  //   .attr('r', 0);


  const itemList = svg
    .append('g')
    .attr('class', 'item-list');

  // var itemListCircle = itemList
  //   .append('circle')
  //   .attr('class', 'circle-container')
  //   .attr('r', 0);


  window.addEventListener('resize', function(){resize()});
  function resize(){
    const svgWidth = +svg.style('width').split('px')[0];
    departmentList.attr('transform', 'translate(' +(svgWidth - 100) +', 95)');
    itemList.attr('transform', 'translate(' +(svgWidth - 100) +', 259)');
  } resize();

  return {
    elements: leftPaneElements,
    groups: groups,
    tableHeader: tableHeader,
    tableBody: tableBody,
    departmentList: departmentList,
    itemList: itemList
  }
}