import RxQ from 'RxQ';
import * as d3 from 'd3';
import Rx from 'rxjs';
import {graphScroll} from 'graph-scroll';

import serverConfig from '../server-config/john-server.json';
import hyperCubeDef from './object-defs/hyperCubeDef.json';
import itemListObjectDef from './object-defs/itemListObjectDef.json';
import departmentListObjectDef from './object-defs/departmentListObjectDef.json';

export default function modelingAssociations(section){
  // ============= RxQ Initialize =============
  // Connect to engine and get app
  var app$ = RxQ.connectEngine(serverConfig, 'warm')
    .qOpenDoc('76928257-797b-4702-8ff9-558d4b467a41');


  // Define getLayout stream
  var hyperCubeLayout$ = 
    app$.qCreateSessionObject(hyperCubeDef)
      .qLayouts();

  // Define item list object stream
  var itemListObject$ = app$.qCreateSessionObject(itemListObjectDef);
  // Define getLayout stream
  var itemLayout$ = itemListObject$.qLayouts();


  // Define department list object stream
  var departmentListObject$ = app$.qCreateSessionObject(departmentListObjectDef);
  // Define getLayout stream
  var departmentLayout$ = departmentListObject$.qLayouts();


  // ============= Create HTML =============
  // Get all left pane elements
  var subtractor = 0;
  const leftPaneElements = d3.selectAll(section +' .body-left > *')
    .classed('hidden', true)
    .attr('id', (d, i) => 'element-' +i);
    
  // Add element grouping attribute
  leftPaneElements.attr('element-group', (d, i) =>{
    if(leftPaneElements._groups[0][i].localName === 'h3'){
      return i - subtractor++;
    } else if(leftPaneElements._groups[0][i].localName === 'ul'){
      return i - subtractor++ - 1;
    }
    else return i - subtractor;
  })

  // Define scroll height
  const scrollHeight = (leftPaneElements._groups[0].length - subtractor)*500;

  // Get section
  var modelingAssociationsSection = d3.select(section)
    .classed('fixed-transition', true)
    .style('height', 'calc(' +scrollHeight +'px + 100vh)');


  modelingAssociationsSection.select('.row')
    .classed('row-graph', true);

  /* Add an invisible line width 0 width to use as the scrolling section
      in graph-scroll */
  const scrollLine = modelingAssociationsSection
    .append('div')
      .classed('scroll-line', true)
      .style('height', 'calc(' +scrollHeight +'px + 100vh)')
    .append('div');

  // Add graph-scroll functionality
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(section))
      .graph(d3.select(section +' .row'))
      .sections(d3.selectAll(section +' .scroll-line'));
  })


  // Get modeling-associations div
  const modelingAssociations = d3.select(section +' .graph');
  

  // Create and append table
  const dataTable = modelingAssociations
    .append('div')
      .attr('class', 'table-container')
    .append('table');

  const tableHeader = dataTable.append('thead');

  const tableBody = dataTable.append('tbody');


  // Create List circles
  const circleContainerRadius = 48.6;

  const svg = modelingAssociations
    .append('svg')
    .attr('width', '100%');


  const departmentList = svg
    .append('g')
    .attr('class', 'department-list');

  const departmentCircle = departmentList
    .append('circle')
    .attr('class', 'circle-container')
    .attr('r', circleContainerRadius);


  const itemList = svg
    .append('g')
    .attr('class', 'item-list');

  const itemCircle = itemList
    .append('circle')
    .attr('class', 'circle-container')
    .attr('r', circleContainerRadius);


  // ============= Resize =============
  Rx.Observable.fromEvent(window, 'resize')
    .startWith('startup resize')
    .subscribe(() =>{
      const svgWidth = +svg.style('width').split('px')[0];
      
      departmentList.attr('transform', 'translate(' +(svgWidth - 100) +', 95)');

      itemList.attr('transform', 'translate(' +(svgWidth - 100) +', 259)');
    });

  



  // ============= Subscribe =============
  // Subscribe to hyperCube layout
  hyperCubeLayout$.subscribe(layout =>{
    // ------------ Table Header ------------
    // Get column labels
    var label = layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}})

    // Create table header row and cells
    tableHeader.selectAll('tr')
        .data([label])
        .enter()
        .append('tr')
      .selectAll('td')
        .data(d => d)
        .enter()
        .append('th')
        .html(d => d.qText);


    // ------------ Table Body ------------
    // qMatrix data
    var data = layout.qHyperCube.qDataPages[0].qMatrix;

    // Attach data to table
    const rowUpdate = tableBody.selectAll('tr')
      .data(data, d => d[0].qText +'|' +d[1].qText);

    
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
  })


  // ------------ List Box ------------
  /* Subscribe each listbox to update its state */
  function listBoxSubscribe(listObjObs$, layoutObs$, listObjectContainer, offset){
    layoutObs$.subscribe(layout =>{
      // qMatrix data
      const data = layout.qListObject.qDataPages[0].qMatrix;
      
      // Attach data
      const theta = 2*Math.PI/data.length;
      const update = listObjectContainer
        .selectAll('.list-object-circle')
        .data(data);


      // Enter new Circle
      const circleEnter = update
          .enter()
          .append('circle')
          .attr('data-qelemno', d=> d[0].qElemNumber)
          .attr('class', 'list-object-circle')
          .attr('cx', (d, i) => (circleContainerRadius/2)*Math.cos(i*theta + offset))
          .attr('cy', (d, i) => (circleContainerRadius/2)*Math.sin(i*theta + offset))
          .attr('r', circleContainerRadius/4)
        .merge(update)
          .style('fill', d =>{
            if(d[0].qState === 'O') return '#fff';
            else if(d[0].qState === 'A') return '#686868';
            else if(d[0].qState === 'X') return '#686868';
            else if(d[0].qState === 'S') return '#45EE59';
          });


      // Enter new Label
      const labelEnter = update
          .enter()
          .append('text')
          .text(d => d[0].qText)
          .attr('data-qelemno', d => d[0].qElemNumber)
          .attr('class', 'list-object-label')
          .attr('x', (d, i) => (circleContainerRadius + 5)*Math.cos(i*theta + offset))
          .attr('y', (d, i) => (circleContainerRadius + 5)*Math.sin(i*theta + offset))
        .merge(update)
          .style('text-anchor', (d, i) =>{
            if(Math.abs(Math.cos(i*theta + offset)) < 0.0000001) return 'middle';
            else if(Math.cos(i*theta + offset) > 0) return 'start';
            else return 'end';
          })
          .style('alignment-baseline', 'middle');
    })

    
    // Create observable from item-list click
    Rx.Observable.fromEvent(listObjectContainer._groups[0][0], 'click')
      .mergeMap(function(evt){ // Merge click observable stream with following observable stream..
        // Get elem no of item just clicked on
        var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));
        
        // Return the observable of the elemno being selected (this will be merged with the click observable)
        if(!isNaN(elemNo)){
          return listObjObs$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
        } else return [null];
      })
      .subscribe()
  }

  listBoxSubscribe(departmentListObject$, departmentLayout$, departmentList, -Math.PI/2);
  listBoxSubscribe(itemListObject$, itemLayout$, itemList, -Math.PI/4);


  // ============= Scroll =============
  var stage = 0;
  var scrollStream = Rx.Observable.fromEvent(window, 'scroll')
    .startWith('startup scroll')
    .map(() => {
      // Get section top position
      var sectionTop = document.querySelector(section).getBoundingClientRect().top;
      var currGroup = 0;

      // Hide elements out of view
      leftPaneElements
        .classed('hidden', (d, i) =>{
          // Get element's group
          var elemGroup = leftPaneElements._groups[0][i].getAttribute('element-group')

          /* If first group, want to always show if sectionTop > -500 */
          if(+elemGroup === 0) {
            if(sectionTop > -500) {
              currGroup = 0;
              return false;
            }
            else return true;
          } 
          
          /* If last group, want to always show if sectionTop < last position */
          else if (+elemGroup === (leftPaneElements._groups[0].length - subtractor - 1)) {
            if(sectionTop <= (+elemGroup)*-500) {
              currGroup = +elemGroup;
              return false;
            }
            else return true;
          } 
          
          /* Else, show element if within range of it's position */
          else {
            if(sectionTop <= (+elemGroup)*-500 && sectionTop > (+elemGroup)*-500 - 500) {
              currGroup = +elemGroup;
              return false;
            }
            else return true;
          }
        })

      return {
        sectionTop: sectionTop,
        elemGroup: currGroup
      }
    })
    .mergeMap((section) =>{
      section.elemGroup = +section.elemGroup;
      // stage = section.elemGroup;
      console.log(section.elemGroup);
      
      // Clear
      if(section.elemGroup < 5 && stage != 0){
        console.log('clear');
        stage = 0;
        return departmentListObject$.qClearSelections('/qListObjectDef');
      }

      // Select Clothing
      else if((section.elemGroup < 13 && section.elemGroup >= 5) && stage != 1){
        console.log('select clothing');
        var prevStage = stage;
        stage = 1;
        if(prevStage > 1) return itemListObject$.qClearSelections('/qListObjectDef');
        else return departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);
      }

      // Select T-Shirt
      else if((section.elemGroup < 15 && section.elemGroup >= 13) && stage != 2){
        console.log('select tshirt');
        stage = 2;
        if(prevStage > 2) return 
        return itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);
      }

      // Clear All
      else if((section.elemGroup < 16 && section.elemGroup >= 15) && stage != 3){
        console.log('clear');
        stage = 3;
        return app$.qClearAll();
      }

      else return [null];

      // if(+section.elemGroup < 5 && !(stage < 5)){
      //   console.log('clear');
      //   stage = +section.elemGroup;
      //   return departmentListObject$.qClearSelections('/qListObjectDef');
      // }
      // else if(+section.elemGroup < 13 && !((stage < 13 && stage >=5))){
      //   stage = +section.elemGroup;
      //   return departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);
      // } 
      // else if(section.elemGroup === 13 && !(stage === 13)) {
      //   stage = section.elemGroup;
      //   return itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);
      // }
      // else return [null];
    })
    .subscribe();
}
