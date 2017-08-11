import Rx from 'rxjs';
import * as d3 from 'd3';

import associationsHtml from './associations-html.js';
import associationsStageObservable from './associations-stage-observable.js';
import paintTable from '../paint-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';
import paintPulseCircles from '../paint-pulse-circles.js';

export default function(sectionClass, app$, objectObservables, appReady$){
  // ============ Global Variables ============
  var altColor = '#686868';
  var selectionTransition = 500;
  const circleContainerRadius = 48.6;

  // ============ HTML ============
  const html = associationsHtml(sectionClass),
    dimensionTable = html.dimensionTable,
    departmentList = html.lists.department,
    itemList = html.lists.item,
    rect = html.rect,
    arrowBase = html.arrow.base,
    arrow = html.arrow.line,
    config = html.config;

  const 
    dimensionHyperCubeObject$ = objectObservables.dimensionHyperCube.object$,
    dimensionHyperCubeLayout$ = objectObservables.dimensionHyperCube.layout$,
    departmentListObject$ = objectObservables.departmentListObject.object$,
    departmentListLayout$ = objectObservables.departmentListObject.layout$,
    itemListObject$ = objectObservables.itemListObject.object$,
    itemListLayout$ = objectObservables.itemListObject.layout$;


  // ============ Selection Functions ============
  function clearAll(){
    return app$.qClearAll();
  };

  function selectClothing(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    );
  };

  function selectClothingTShirt(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    )
  }

  function selectTShirtCamera(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true)
    )
  };

  function selectTShirtCameraClothing(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    )
  };

  function selectFurniture(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [0], true)
    )
  }
   /* Function to generate observable that triggers when it is within or past a
      specified stage */
  function greaterThanObservable(stage){
    // When app is ready, emit stage status
    const stageInitial$ = appReady$.withLatestFrom(stage$)
      .map(m => m[1] >= stage);

    /* When changing stage, as long as appReady has emitted a value,
        emit stage status */
    const stageApp$ = stageDebounced$.withLatestFrom(appReady$)
      .map(m => m[0] >= stage);

    /* Create a new observable by merging the two above. Only emit when the status
        changes */
    const mergedObservable$ = Rx.Observable.merge(stageInitial$, stageApp$).distinctUntilChanged();

    return mergedObservable$;
  }

  function equalToObservable(stage){
    // When app is ready, emit stage status
    const stageInitial$ = appReady$.withLatestFrom(stage$)
      .map(m => m[1] === stage);

    /* When changing stage, as long as appReady has emitted a value,
        emit stage status */
    const stageApp$ = stageDebounced$.withLatestFrom(appReady$)
      .map(m => m[0] === stage);

    /* Create a new observable by merging the two above. Only emit when the status
        changes */
    const mergedObservable$ = Rx.Observable.merge(stageInitial$, stageApp$).distinctUntilChanged();

    return mergedObservable$;
  }


  // ============ Observables ============
  const stage$ = associationsStageObservable(sectionClass);
  // stage$.subscribe(s => console.log(s));
  /* Creating a debounced emitter so that fast scrolling isn't triggering many selections */
  const stageDebounced$ = stage$
    .debounceTime(150);

  // ============ Subscribe ============
 
  
  // Dimension HyperCube
  dimensionHyperCubeLayout$
    .subscribe(layout => paintTable(dimensionTable, layout, selectionTransition));
  
    
  // ***** Stage 1 *****
  const stage1$ = new greaterThanObservable(1)
    
  stage1$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  itemListLayout$
    .withLatestFrom(stage1$)
    .filter(f => f[1])
    .pluck('0')
    .do(qMatrix =>{
      paintListContainer(itemList, [1], circleContainerRadius, 'Item', 1.25);
      paintListValues(itemList, qMatrix, Math.PI/4, altColor, selectionTransition);
    })
    .subscribe();

  stage1$
    .filter(f => !f[0])
    .do(() =>{
      paintListContainer(itemList, [], circleContainerRadius, '', 1.25);
      paintListValues(itemList, [], Math.PI/4, altColor, selectionTransition);
    })
    .subscribe();

  

  // ***** Stage 2 *****
  const stage2$ = new greaterThanObservable(2);

  // Clear App Selections
  stage2$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  // Clearing app will trigger ListObject Layout
  departmentListLayout$
    .withLatestFrom(stage2$)
    .filter(f => f[1])
    .pluck('0')
    .do(qMatrix =>{
      paintListContainer(departmentList, [1], circleContainerRadius, 'Department', 1.5);
      paintListValues(departmentList, qMatrix, Math.PI/6, altColor, selectionTransition);
    })
    .subscribe();

  // Destroy list objects
  stage2$
    .filter(f => !f)
    .do(() =>{
      paintListContainer(departmentList, [], circleContainerRadius, '', 1.5);
      paintListValues(departmentList, [], Math.PI/6, altColor, selectionTransition);
    })
    .subscribe();


  // ***** Stage 3 *****
  const stage3$ = new greaterThanObservable(3);

  // Create Connector
  stage3$
    .filter(f => f)
    .subscribe(() =>{
      rect
        .transition()
        .duration(750)
        .style('opacity', 1);

      arrowBase
        .transition()
        .duration(750)
        .style('opacity', 1);

      arrow
        .attr('x2', config.lists.department.x - 4)
        .transition()
        .duration(750)
        .attr('x2', 207);
    });

  // Destroy Connector
  stage3$
    .filter(f => !f)
    .subscribe(() =>{
      rect
        .transition()
        .duration(750)
        .style('opacity', 0);

      arrowBase
        .transition()
        .duration(750)
        .style('opacity', 0);

      arrow
        .transition()
        .duration(750)
        .attr('x2', config.lists.department.x - 4)
    });


  // ***** Stage 4 *****
  const stage4$ = equalToObservable(4);

  stage4$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();


  // ***** Stage 5 *****
  const stage5$ = equalToObservable(5);

  stage5$
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ***** Stage 6 *****
  const stage6$ = equalToObservable(6);

  stage6$
    .filter(f => f)
    .mergeMap(() => selectClothingTShirt())
    .subscribe();


  // ***** Stage 7 *****
  const stage7$ = equalToObservable(7);

  stage7$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();


  // ***** Stage 8 *****
  const stage8$ = equalToObservable(8);

  stage8$
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();

  
  // ***** Stage 9 *****
  const stage9$ = equalToObservable(9);

  stage9$
    .filter(f => f)
    .mergeMap(() => selectTShirtCameraClothing())
    .subscribe();


  // ***** Stage 10 *****
  const stage10$ = equalToObservable(10);

  stage10$
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();
    

  // ***** Stage 11 *****
  const stage11$ = equalToObservable(11);

  stage11$
    .filter(f => f)
    .mergeMap(() => selectFurniture())
    .subscribe();
    

  // ***** Stage 12 *****
  const stage12$ = equalToObservable(12);

  stage12$
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();


  // ***** Stage 13 *****
  const stage13$ = greaterThanObservable(13);

  stage13$
    .filter(f => f)
    .withLatestFrom(itemListLayout$)
    .pluck('1')
    .subscribe(qMatrix =>{
      altColor = '#BEBEBE';
      paintListContainer(itemList, [1], circleContainerRadius, 'Item', 1.25);
      paintListValues(itemList, qMatrix, Math.PI/4, altColor, selectionTransition);
    });

  stage13$
    .filter(f => !f)
    .subscribe(() =>{
      altColor = '#686868';
    });

  
  // ***** Stage 14 *****
  const stage14$ = greaterThanObservable(14);

  // Pulse Function
  /* Takes in a d3 selection and whether it should be pulsing or not.
      If pulseActive is true, the transition will fade in then out and then
      call the recursive transition again. if false, it will fade out then stop */
  function pulse(selection, pulseActive){
    recursiveTransition();
    function recursiveTransition(){
      if(pulseActive){
        selection
          .transition()
          .duration(500)
          .style('opacity', 0.8)
          .transition()
          .duration(500)
          .style('opacity', 0)
          .on('end', recursiveTransition)
      } else{
        selection
          .transition()
          .duration(500)
          .style('opacity', 0);
      }
    }
  }

  // Add Class
  Rx.Observable.combineLatest(departmentListLayout$, itemListLayout$, stage14$)
    .filter(f => f[2])
    .subscribe(s =>{
      const listObjectCircles = d3.selectAll(sectionClass +' .list-object-circle');
      listObjectCircles
        .classed('selectable', true);
      d3.selectAll(sectionClass +' .list-object-checkmark')
        .classed('selectable', true);

      // Paint List Container and Values before the blue circles
      paintListContainer(departmentList, [1], circleContainerRadius, 'Department', 1.5);
      paintListValues(departmentList, s[0], Math.PI/6, altColor, selectionTransition);
      
      paintListContainer(itemList, [1], circleContainerRadius, 'Item', 1.25);
      paintListValues(itemList, s[1], Math.PI/4, altColor, selectionTransition);
      
      paintPulseCircles(departmentList, [1, 1, 1], Math.PI/6);
      paintPulseCircles(itemList, [1, 1, 1, 1], Math.PI/4);

      selectionTransition = 0;
    });

  stage14$
    .filter(f => f)
    .subscribe(() =>{
      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, true);
    })

  // Remove Class
  stage14$.filter(f => !f)
    .subscribe(() =>{
      d3.selectAll(sectionClass +' .list-object-circle')
        .classed('selectable', false);
      d3.selectAll(sectionClass +' .list-object-checkmark')
        .classed('selectable', false);

      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, false);

      selectionTransition = 500;
    });

  Rx.Observable.fromEvent(itemList._groups[0][0], 'click')
    .withLatestFrom(stage$)
    .filter(f => f[1] >= 14)
    .pluck('0')
    .do(() =>{
      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, false);
    })
    .mergeMap(evt =>{// Merge click observable stream with following observable stream..
      // Get elem no of item just clicked on
      var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));
      
      if(!isNaN(elemNo)) return itemListObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
      else return [];
    }).subscribe();

  Rx.Observable.fromEvent(departmentList._groups[0][0], 'click')
    .withLatestFrom(stage$)
    .filter(f => f[1] >= 14)
    .pluck('0')
    .do(() =>{
      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, false);
    })
    .mergeMap(evt =>{// Merge click observable stream with following observable stream..
      // Get elem no of item just clicked on
      var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));

      if(!isNaN(elemNo)) return departmentListObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
      else return [];
    }).subscribe();
}