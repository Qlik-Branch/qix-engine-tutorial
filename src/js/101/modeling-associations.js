import RxQ from 'RxQ';
import * as d3 from 'd3';
import Rx from 'rxjs';
import {graphScroll} from 'graph-scroll';

import serverConfig from '../server-config/john-server.json';
import hyperCubeDef from './object-defs/hyperCubeDef.json';
import itemListObjectDef from './object-defs/itemListObjectDef.json';
import departmentListObjectDef from './object-defs/departmentListObjectDef.json';

export default function modelingAssociations(section){
  var altColor = '#686868',
      selectionActive = false;

  // ============= RxQ Initialize =============
  // Connect to engine and get app
  const app$ = RxQ.connectEngine(serverConfig, 'warm')
    .qOpenDoc('76928257-797b-4702-8ff9-558d4b467a41');


  // Define getLayout stream
  const hyperCubeLayout$ = 
    app$.qCreateSessionObject(hyperCubeDef)
      .qLayouts();

  // Define item list object stream
  const itemListObject$ = app$.qCreateSessionObject(itemListObjectDef);
  const itemLayout$ = itemListObject$.qLayouts();


  // Define department list object stream
  const departmentListObject$ = app$.qCreateSessionObject(departmentListObjectDef);
  const departmentLayout$ = departmentListObject$.qLayouts();


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
  const groups = leftPaneElements._groups[0].length - subtractor;
  const scrollHeight = (leftPaneElements._groups[0].length - subtractor)*500;

  // Get section
  const modelingAssociationsSection = d3.select(section)
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


  // ============= HyperCube =============
  // Subscribe to hyperCube layout
  hyperCubeLayout$.subscribe(layout =>{
    // ------------ Table Header ------------
    // Get column labels
    const label = layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}})

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
    const data = layout.qHyperCube.qDataPages[0].qMatrix;

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
  function paintListBox(data, listObjectContainer, offset){
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
          else if(d[0].qState === 'A') return altColor;
          else if(d[0].qState === 'X') return '#686868';
          else if(d[0].qState === 'XS') return '#686868';
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
  }

  /* Subscribe each listbox to update its state */
  function listBoxSubscribe(listObjObs$, layoutObs$, listObjectContainer, offset){
    layoutObs$.subscribe(layout =>{
      // qMatrix data
      const data = layout.qListObject.qDataPages[0].qMatrix;

      paintListBox(data, listObjectContainer, offset);
    })

    
    // // Create observable from item-list click
    // Rx.Observable.fromEvent(listObjectContainer._groups[0][0], 'click')
    //   .mergeMap(function(evt){ // Merge click observable stream with following observable stream..
    //     // Get elem no of item just clicked on
    //     var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));
        
    //     // Return the observable of the elemno being selected (this will be merged with the click observable)
    //     if(!isNaN(elemNo) && selectionActive){
    //       return listObjObs$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
    //     } else return [null];
    //   })
    //   .subscribe()
  }

  // listBoxSubscribe(departmentListObject$, departmentLayout$, departmentList, -Math.PI/2);
  // listBoxSubscribe(itemListObject$, itemLayout$, itemList, -Math.PI/4);


  // ============= Scroll =============
  var prevParagraph, prevStage; // Hold state of prevStage and prevParagraph

  /* Scroll observable that emits the scroll position relative to the top of 
      the modeling-associations section */
  const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
    .map(() => document.querySelector(section).getBoundingClientRect().top);
    

  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const paragraphSubject = new Rx.Subject();

  /* Observable to emit the current paragraph section we scroll to. Only emits
      when a new paragraph is reached (paragraph != prevParagraph) */
  const paragraphStream = scrollStream
    .map(sectionTop =>{
      // Return current paragraph section 
      if(sectionTop >= -500) return 0;
      else if(sectionTop < -500*groups) return groups;
      else return Math.floor(sectionTop/-500);
    })
    .filter(paragraph => {
      // Only emit if we see a new paragraph
      if(paragraph === prevParagraph) return false;
      else {
        prevParagraph = paragraph;
        return true;
      }
    });


  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const stageSubject = new Rx.Subject();

  /* Observable to emit the current selection stage */
  const stageStream = paragraphSubject
    .map(paragraph => {
      // Return stage
      if(paragraph < 5)       return 0;   // Clear all
      else if(paragraph < 13) return 1;   // Select Clothing
      else if(paragraph < 15) return 2;   // Select T-Shirt
      else if(paragraph < 16) return 3;   // Clear all
      else if(paragraph < 18) return 4;   // Select T-Shirt and Camera
      else if(paragraph < 19) return 5;   // Select Clothing
      else if(paragraph < 21) return 6;   // Select ONLY T-Shirt and Camera
      else if(paragraph < 22) return 7;   // Select Furniture
      else if(paragraph < 24) return 8;   // Select T-Shirt and Camera
      else if(paragraph < 27) return 9;   // Alternative Grey
      else                    return 10;  // Interactive
    })
    .filter(stage =>{
      // Only emit if we see a new stage
      if(stage === prevStage) return false;
      else {
        prevStage = stage;
        return true;
      }
    });


  /* Subscribe to paragraph stream and display when in appropriate section */
  paragraphSubject.subscribe(paragraph =>{
    console.log('paragraph: ', paragraph);
    leftPaneElements.classed('hidden', (d, i) => paragraph != +leftPaneElements._groups[0][i].getAttribute('element-group'))
  });


  /* Declare different selection observables */
  // const clearAll = app$.qClearAll();
  // const selectClothing = departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);
  // const selectTShirt = itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true);

  
  const clearAll = stageSubject
    .filter(stage => stage === 0 || stage === 3)
    .mergeMap(() => app$.qClearAll());

  const selectClothing = stageSubject
    .filter(stage => stage === 1)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));
  
  const selectClothingTShirt = stageSubject
    .filter(stage => stage === 2)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true), 
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));

  const selectTShirtCamera = stageSubject
    .filter(stage => stage === 4 || stage === 6 || stage === 8 || stage === 9)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true)
    ));

  const selectTShirtCameraClothing = stageSubject
    .filter(stage => stage === 5)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));

  const selectTShirtCameraFurniture = stageSubject
    .filter(stage => stage === 7)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [0], true)
    ));

  const setAlternativeGrey = stageSubject
    .do(stage =>{
      if(stage < 9) altColor = '#686868';
      else altColor = '#BEBEBE';
    });

  const setInteractivity = stageSubject
    .do(stage =>{
      if(stage === 10) selectionActive = true;
      else selectionActive = false;
    });


  // Merge all selection observables
  const mergedSelection = Rx.Observable.merge(
    clearAll,
    selectClothing,
    selectClothingTShirt,
    selectTShirtCamera,
    selectTShirtCameraClothing,
    selectTShirtCameraFurniture,
    setAlternativeGrey,
    setInteractivity
  );


  /* On emmission of app observable, switch to merged selection observables */
  app$.switchMap(() => mergedSelection).subscribe();


  /* Subscribe stream to all subjects */
  paragraphStream.subscribe(paragraphSubject);
  stageStream.subscribe(stageSubject);

}
