import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

export default function(sectionClass){
  // ========== Config ==========
  const config = {
    lists: {
      department: {
        x: 400,
        y: 95
      },
      item: {
        x: 400,
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
  const dimensionTable = d3Graph
    .append('div')
      .attr('class', 'table-container dim-table')
    .append('table');

  const factTable = d3Graph
    .append('div')
      .attr('class', 'table-container fact-table')
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

  
  // List Groups
  const departmentList = svg
    .append('g')
    .attr('class', 'department-list list')
    .attr('transform', `translate(${config.lists.department.x}, ${config.lists.department.y})`);

  const itemList = svg
    .append('g')
    .attr('class', 'item-list list')
    .attr('transform', `translate(${config.lists.item.x}, ${config.lists.item.y})`);


  return {
    d3Paragraphs: d3Paragraphs,
    dimensionTable: {
      header: dimensionTableHeader,
      body: dimensionTableBody
    },
    factTable: {
      header: factTableHeader,
      body: factTableBody
    },
    lists: {
      department: departmentList,
      item: itemList
    }
  }
}