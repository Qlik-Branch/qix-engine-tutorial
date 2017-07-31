import Rx from 'rxjs';
import * as d3 from 'd3';

import connectToApp from '../lib/connect-to-app.js';
import serverConfig from '../server-config/john-server.json';
import associationsHtml from './associations-html.js';
import associationsStageObservable from './associations-stage-observable.js';
import associationsAppObjects from './associations-app-objects.js';
import associationsPaintTable from './associations-paint-table.js';
import associationsPaintListContainer from './associations-paint-list-container.js';
import associationsPaintListValues from './associations-paint-list-values.js';

export default function(){
  var altColor = '#686868';
  var selectionActive = false;
  const circleContainerRadius = 48.6;

  // ============ HTML ============
  const html = associationsHtml('.modeling-associations', circleContainerRadius);
  // console.log(html);
  const paragraphs = html.elements;


  // ============ Observables ============
  const [paragraphSubject, stageSubject] = associationsStageObservable('.modeling-associations', html);

  stageSubject.subscribe(stage =>{
    console.log('stage: ', stage);
  });
  window.addEventListener('load', function(){
    stageSubject
      .take(1)
      .subscribe(stage =>{
        if(stage){
          document.querySelector('body').scrollTop = 3000;
        }
      });
  })

  // update paragraph display using paragraph observable
  const bodyLeft = d3.select('.modeling-associations .body-left');
  // Start bodyTop counter
  // var bodyTop = 40;
  var prevParagraph = 0;

  paragraphSubject.subscribe(paragraph =>{
    paragraphs
      .style('opacity', (d, i) =>{
        if(paragraph != +paragraphs._groups[0][i].getAttribute('element-group')) return 0.25;
        else return 1;
      })

    
    bodyLeft
      .transition()
      .duration(150)
      .style('top', () =>{ // set body-left top..
        var groupHeight = 0;
        // For each element..
        paragraphs._groups[0].forEach((element, i) =>{
          // if element is before current paragraph..
          if(paragraph > +element.getAttribute('element-group')){
            // Add elnement height to groupHeight
            const style = element.currentStyle || window.getComputedStyle(element);
            var margin = 0;

            if(element.localName != 'h3'){
              margin += +style.marginTop.split('px')[0];
            }
              margin += +style.marginBottom.split('px')[0];
            groupHeight += element.offsetHeight + margin;
          }
        });

        return -groupHeight +'px';
      });

    prevParagraph = paragraph;
  })

  // Get app observable;
  const app$ = connectToApp(serverConfig, '76928257-797b-4702-8ff9-558d4b467a41');

  // Get app object observables
  const [hyperCube$, itemListObject$, departmentListObject$] = associationsAppObjects(app$);


  // ============ Subscribe ============
  // HyperCube
  hyperCube$.qLayouts()
    .subscribe(layout =>{
      // Get data
      const headerData = layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}});
      const bodyData = layout.qHyperCube.qDataPages[0].qMatrix;

      // Paint Table
      associationsPaintTable(html.tableHeader, headerData, html.tableBody, bodyData);
    });

  // State of Item ListObject
  var subscribeToItemList = false,
      subscribeToDepartmentList = false,
      itemListIndex = 0,
      departmentListIndex = 0;

  // Item ListObject
  /* Item List Object observable will call the paint function whenever the list object updates */
  itemListObject$.qLayouts()
    .filter(() => subscribeToItemList)
    .map((layout, i) => {
      return layout.qListObject.qDataPages[0].qMatrix.map(d =>{
        d[0].index = itemListIndex;
        return d;
      });
    })
    .subscribe(qMatrix =>{
      associationsPaintListValues(html.itemList, qMatrix, -Math.PI/4, altColor);
    });

  Rx.Observable.fromEvent(html.itemList._groups[0][0], 'click')
    .mergeMap(function(evt){ // Merge click observable stream with following observable stream..
      // Get elem no of item just clicked on
      var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));

      // Return the observable of the elemno being selected (this will be merged with the click observable)
      if(!isNaN(elemNo) && selectionActive){
        return itemListObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
      } else return [null];
    })
    .subscribe();

  // Department ListObject
  departmentListObject$.qLayouts()
    .filter(() => subscribeToDepartmentList)
    .map((layout, i) =>{
      return layout.qListObject.qDataPages[0].qMatrix.map(d =>{
        d[0].index = departmentListIndex;
        return d;
      })
    })
    .subscribe(qMatrix =>{
      associationsPaintListValues(html.departmentList, qMatrix, -Math.PI/2, altColor);
    });

  Rx.Observable.fromEvent(html.departmentList._groups[0][0], 'click')
    .mergeMap(function(evt){ // Merge click observable stream with following observable stream..
      // Get elem no of item just clicked on
      var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));

      // Return the observable of the elemno being selected (this will be merged with the click observable)
      if(!isNaN(elemNo) && selectionActive){
        return departmentListObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
      } else return [null];
    })
    .subscribe();


  // ============ Stage ============
  // ****** 0 ******
  const destroyItemListObject = stageSubject
    .filter(stage => stage === 0)
    .do(() =>{
      // Increase itemListIndex
      itemListIndex++;
      // RePaint itemList with empty data
      associationsPaintListContainer(html.itemList, [], circleContainerRadius);
      // Turn off itemList Subscription
      subscribeToItemList = false;
      // RePaint itemList values with empty data
      associationsPaintListValues(html.itemList, [], -Math.PI/4, altColor);
    })

  // ****** 1 ******
  const paintItemListObject = stageSubject
    .filter(stage => stage === 1)
    .mergeMap(stage => {
      // Paint list Container with itemListIndex datum
      associationsPaintListContainer(html.itemList, [itemListIndex], circleContainerRadius);
      // ReSubscribe to itemList
      subscribeToItemList = true;

      departmentListIndex++;
      associationsPaintListContainer(html.departmentList, [], circleContainerRadius);
      subscribeToDepartmentList = false;
      associationsPaintListValues(html.departmentList, [], -Math.PI/2, altColor);

      // Call clearAll() so that listObject qLayouts() is called
      return app$.qClearAll();
    });

  // ****** 2 ******
  const paintDepartmentListObject = stageSubject
    .filter(stage => stage === 2)
    .mergeMap(stage =>{
      // Paint Department List Container with departmentListIndex
      associationsPaintListContainer(html.departmentList, [departmentListIndex], circleContainerRadius);
      // Subscribe to departmentListObject
      subscribeToDepartmentList = true;

      html.rect
        .transition()
        .duration(750)
        .style('opacity', 0);

      html.arrowBase
        .transition()
        .duration(750)
        .style('opacity', 0);

      html.arrow
        .transition()
        .duration(750)
        .attr('x2', 400 - 4)

      // Call clearAll() so that listObject qLayouts() is called
      return app$.qClearAll();
    });

  // ****** 3 ******
  const paintListObjectConnector = stageSubject
    .filter(stage => stage === 3)
    .do(() =>{
      html.rect
        .transition()
        .duration(750)
        .style('opacity', 1);

      html.arrowBase
        .transition()
        .duration(750)
        .style('opacity', 1);

      html.arrow
        .transition()
        .duration(750)
        .attr('x2', 400 - 194.5);
    });

  // ****** 4 ******
  const clearAll = stageSubject
    .filter(stage => [4, 7].indexOf(stage) != -1)
    .mergeMap(() => app$.qClearAll());

  // ****** 5 ******
  const selectClothing = stageSubject
    .filter(stage => stage === 5)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));

  // ****** 6 ******
  const selectTShirt = stageSubject
    .filter(stage => stage === 6)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));

  // ****** 8 ******
  const selectTShirtCamera = stageSubject
    .filter(stage => [8, 10, 12].indexOf(stage) != -1)
    .mergeMap(() => {
      altColor = '#686868';
      return Rx.Observable.merge(
        app$.qClearAll(),
        itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true)
      )
    });

  // ****** 9 ******
  const selectTShirtCameraClothing = stageSubject
    .filter(stage => stage === 9)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    ));

  // ****** 11 ******
  const selectFurniture = stageSubject
    .filter(stage => stage === 11)
    .mergeMap(() => Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [0], true)
    ));

  // ****** 13 ******
  const changeAltColor = stageSubject
    .filter(stage => stage === 13)
    .mergeMap(() =>{
      altColor = '#BEBEBE';
      return Rx.Observable.merge(
        app$.qClearAll(),
        itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true)
      )
    })
    
  const setInteractivity = stageSubject
    .do(stage =>{
      if(stage === 14) selectionActive = true;
      else selectionActive = false;
    })
  
    
  // Merge all stages
  const mergedStages = Rx.Observable.merge(
    destroyItemListObject,
    paintItemListObject,
    paintDepartmentListObject,
    paintListObjectConnector,
    clearAll,
    selectClothing,
    selectTShirt,
    selectTShirtCamera,
    selectTShirtCameraClothing,
    selectFurniture,
    changeAltColor,
    setInteractivity
  );

  // Once app$ emits something, switch to merged observables
  app$.switchMap(() => mergedStages).subscribe();
}