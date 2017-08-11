import Rx from 'rxjs';
import * as d3 from 'd3';


import multipleHtml from './multiple-html.js';
import multipleStageObservable from './multiple-stage-observable.js';
import paintTable from '../paint-table.js';
import paintDynamicTable from '../paint-dynamic-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';
import paintPulseCircles from '../paint-pulse-circles.js';

export default function(sectionClass, app$, objectObservables, appReady$){
  var altColor = '#BEBEBE';
  var selectionTransition = 500;
  const listContainerRadius = 48.6;

  // ============ HTML Setup ============
  const htmlSetup = multipleHtml(sectionClass),
    d3Paragraphs = htmlSetup.d3Paragraphs,
    dimensionTableContainer = htmlSetup.dimensionTable.container,
    dimensionTable = htmlSetup.dimensionTable,
    factTableContainer = htmlSetup.factTable.container,
    factTable = htmlSetup.factTable,
    departmentSalesTableContainer = htmlSetup.departmentSalesTable.container,
    departmentSalesTable = htmlSetup.departmentSalesTable,
    departmentList = htmlSetup.lists.department,
    itemList = htmlSetup.lists.item,
    dayList = htmlSetup.lists.day,
    salesList = htmlSetup.lists.sales,
    bottomRect = htmlSetup.rects.bottom,
    bottomArrow = htmlSetup.arrows.bottomArrow,
    bottomArrowBase = htmlSetup.arrows.bottomArrowBase,
    sumLabel = htmlSetup.sum.label,
    sumStaticLine = htmlSetup.sum.staticLine,
    sumDynamicLine = htmlSetup.sum.dynamicLine,
    sumOutput = htmlSetup.sum.output,
    sumOutputValue = htmlSetup.sum.outputValue,
    config = htmlSetup.config;

  const 
    dimensionHyperCubeObject$ = objectObservables.dimensionHyperCube.object$,
    dimensionHyperCubeLayout$ = objectObservables.dimensionHyperCube.layout$,
    factHyperCubeObject$ = objectObservables.factHyperCube.object$,
    factHyperCubeLayout$ = objectObservables.factHyperCube.layout$,
    departmentListObject$ = objectObservables.departmentListObject.object$,
    departmentListLayout$ = objectObservables.departmentListObject.layout$,
    itemListObject$ = objectObservables.itemListObject.object$,
    itemListLayout$ = objectObservables.itemListObject.layout$,
    dayListObject$ = objectObservables.dayListObject.object$,
    dayListLayout$ = objectObservables.dayListObject.layout$,
    salesListObject$ = objectObservables.salesListObject.object$,
    salesListLayout$ = objectObservables.salesListObject.layout$,
    salesSumObject$ = objectObservables.salesSumObject.object$,
    salesSumLayout$ = objectObservables.salesSumObject.layout$,
    departmentSalesHyperCubeObject$ = objectObservables.departmentSalesHyperCube.object$,
    departmentSalesHyperCubeLayout$ = objectObservables.departmentSalesHyperCube.layout$;

  
  // ============ Selection Functions ============
  function clearAll(){
    return app$.qClearAll();
  };

  function selectTShirtCamera(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      itemListObject$.qSelectListObjectValues('/qListObjectDef', [1, 3], true)
    )
  };

  function selectClothing(){
    return Rx.Observable.merge(
      app$.qClearAll(),
      departmentListObject$.qSelectListObjectValues('/qListObjectDef', [1], true)
    );
  };

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
  // factHyperCubeObject$.subscribe(s => console.log(s));
  // const appReady$ = dimensionHyperCubeObject$
  //   .withLatestFrom(factHyperCubeObject$)
  //   .withLatestFrom(departmentListObject$)
  //   .withLatestFrom(itemListObject$)
  //   .withLatestFrom(dayListObject$)
  //   .withLatestFrom(salesListObject$)
  //   .withLatestFrom(salesSumObject$)
  //   .withLatestFrom(departmentSalesHyperCubeObject$)
  //   .publish();

  // const dimensionHyperCubeReady$ = dimensionHyperCubeObject$.take(1);
  // const factHyperCubeReady$ = dimensionHyperCubeReady$
  //   .concat(factHyperCubeObject$.take(1));
  // const departmentListObjectReady$ = factHyperCubeReady$
  //   .concat(departmentListObject$.take(1));
  // const itemListObjectReady$ = departmentListObjectReady$
  //   .concat(itemListObject$.take(1));
  // const dayListObjectReady$ = itemListObjectReady$
  //   .concat(dayListObject$.take(1));
  // const salesListObjectReady$ = dayListObjectReady$
  //   .concat(salesListObject$.take(1));
  // const salesSumObjectReady$ = salesListObjectReady$
  //   .concat(salesSumObject$.take(1));
  // const departmentSalesHyperCubeReady$ = salesSumObjectReady$
  //   .concat(departmentSalesHyperCubeObject$.take(1));

  // const mergedValues = dimensionHyperCubeObject$
  //   .merge(factHyperCubeObject$)
  //   .merge(departmentListObject$)
  //   .merge(itemListObject$)
  //   .merge(dayListObject$)
  //   .merge(salesListObject$)
  //   .merge(salesSumObject$)
  //   .merge(departmentSalesHyperCubeObject$)
  //   .publish();
  
  //   mergedValues.connect();

  // const appReady$ = Rx.Observable.concat(departmentSalesHyperCubeReady$)
  //   .publish();

  // mergedValues.subscribe(s => console.log(s));
  
  const stage$ = multipleStageObservable(sectionClass);
  stage$.subscribe(s => console.log(s))

  const stageDebounced$ = stage$.debounceTime(150);

  
  // ============ Subscribe ============
  // Dimension HyperCube
  dimensionHyperCubeLayout$.subscribe(layout =>{
    paintTable(dimensionTable, layout, selectionTransition);
  });


  // Fact HyperCube
  factHyperCubeLayout$.subscribe(layout =>{
    paintTable(factTable, layout, selectionTransition);
  });


  // Department Sales HyperCube
  departmentSalesHyperCubeLayout$.subscribe(layout =>{
    paintDynamicTable(departmentSalesTable, layout);
  })


  // Department ListObject
  departmentListLayout$.subscribe(qMatrix =>{
    paintListValues(departmentList, qMatrix, -Math.PI/2, altColor, selectionTransition);
  });


  // Item ListObject
  itemListLayout$.subscribe(qMatrix =>{
    paintListValues(itemList, qMatrix, -Math.PI/4, altColor, selectionTransition);
  });


  // Sales Sum
  salesSumLayout$
    .withLatestFrom(stage$)
    .filter(f => f[1] >= 8 && f[1] < 11)
    .pluck('0')
    .subscribe(sales =>{
      sumDynamicLine
          .attr('y2', config.lists.sales.y + config.lists.radius*1.2)
        .transition()
        .duration(250)
          .attr('y2', config.lists.sales.y + config.lists.radius*2.5);

      setTimeout(function(){
        sumOutputValue.html(sales);
      }, 250)
    })

  // ============ Stage 1 ============
  const stage1$ = new greaterThanObservable(1);

  // Clear All
  stage1$
    .filter(f => f)
    .subscribe(() =>{
      factTableContainer
        .transition()
        .duration(750)
        .style('opacity', 1);
    });

  stage1$
    .filter(f => !f)
    .subscribe(() =>{
      factTableContainer
        .transition()
        .duration(750)
        .style('opacity', 0);
    })


  // ============ Stage 2 ============
  const stage2$ = new greaterThanObservable(2);

  // Clear All and Create Bottom Connector
  stage2$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe(() =>{
      bottomArrow
        .transition()
        .duration(750)
        .attr('x2', 273);

      [bottomRect, bottomArrowBase].forEach(d3Element =>{
        d3Element
          .transition()
          .duration(750)
          .style('opacity', 1);
      });
    });

  // Create Day List
  dayListLayout$
    .withLatestFrom(stage2$)
    .filter(f => f[1])
    .pluck('0')
    .subscribe(qMatrix =>{
      console.log(qMatrix);
      paintListContainer(dayList, [1], listContainerRadius, 'Day', 1.5);
      paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor, selectionTransition);
    });

  // Create Sales List
  salesListLayout$
    .withLatestFrom(stage2$)
    .filter(f => f[1])
    .pluck('0')
    .subscribe(qMatrix =>{
      console.log(qMatrix);
      paintListContainer(salesList, [1], listContainerRadius, 'Sales', 1.5);
      paintListValues(salesList, qMatrix, Math.PI/6, altColor, selectionTransition);
    });

  // Destroy All
  stage2$
    .filter(f => !f)
    .subscribe(() => {
      bottomArrow
        .transition()
        .duration(750)
        .attr('x2', config.lists.item.x - 4);

      [bottomRect, bottomArrowBase].forEach(d3Element =>{
        d3Element
          .transition()
          .duration(750)
          .style('opacity', 0);
      });

      // Destroy Day List Object
      paintListContainer(dayList, [], listContainerRadius, '', 1.5);
      paintListValues(dayList, [], Math.PI*(3/4), altColor, selectionTransition);

      // Destroy Sales List Object
      paintListContainer(salesList, [], listContainerRadius, '', 1.5);
      paintListValues(salesList, [], Math.PI/6, altColor, selectionTransition);
    });


  // ============ Stage 3 ============
  const stage3$ = new equalToObservable(3)
  stage3$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();
    
    
  // ============ Stage 4 ============
  const stage4$ = new equalToObservable(4)
  stage4$
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();


  // ============ Stage 5 ============
  const stage5$ = new equalToObservable(5)
  stage5$
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ============ Interactivity ============
  // const interactiveStage$ = Rx.Observable.combineLatest(app$, stage$)
  //   .map(f => [6, 10, 12].indexOf(f[1]) != -1)
  //   .distinctUntilChanged();
    
  const interactiveInitial$ = appReady$.withLatestFrom(stage$)
    .map(m => [6, 10, 12].indexOf(m[1]) != -1);

  const interactiveApp$ = stageDebounced$.withLatestFrom(appReady$)
    .map(m => [6, 10, 12].indexOf(m[0]) != -1);

  const interactiveStage$ = Rx.Observable.merge(interactiveInitial$, interactiveApp$)
    .distinctUntilChanged();

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
    
  interactiveStage$
    .filter(f => f)
    .withLatestFrom(dayListLayout$)
    .withLatestFrom(salesListLayout$)
    .subscribe(s =>{
      const listObjectCircles = d3.selectAll(sectionClass +' .list-object-circle');
      listObjectCircles
        .classed('selectable', true);
      d3.selectAll(sectionClass +' .list-object-checkmark')
        .classed('selectable', true);
      selectionTransition = 0;
      
      paintPulseCircles(departmentList, [1, 1, 1], Math.PI/6);
      paintPulseCircles(itemList, [1, 1, 1, 1], Math.PI/4);

      // Paint List Container and values first so that highlighting rings don't get painted underneath
      paintListContainer(dayList, [1], listContainerRadius, 'Day', 1.5);
      paintListValues(dayList, s[0][1], Math.PI*(3/4), altColor, selectionTransition);
      paintPulseCircles(dayList, [1, 1, 1, 1], Math.PI*(3/4));

      paintListContainer(salesList, [1], listContainerRadius, 'Sales', 1.5);
      paintListValues(salesList, s[1], Math.PI/6, altColor, selectionTransition);
      paintPulseCircles(salesList, [1, 1, 1, 1, 1, 1], Math.PI/6);

      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, true);
    });

  interactiveStage$
    .filter(f => !f)
    .subscribe(() =>{
      d3.selectAll(sectionClass +' .list-object-circle')
        .classed('selectable', false);
      d3.selectAll(sectionClass +' .list-object-checkmark')
        .classed('selectable', false);
      selectionTransition = 500;

      const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
      pulse(highlightCircle, false);
    })


  function listObjectInteractivity(list, listObject$){
    Rx.Observable.fromEvent(list._groups[0][0], 'click')
      .withLatestFrom(stage$)
      .filter(f => [6, 10, 12].indexOf(f[1]) != -1)
      .pluck('0')
      .do(() =>{
        const highlightCircle = d3.selectAll(sectionClass +' .highlight-circle');
        pulse(highlightCircle, false);
      })
      .mergeMap(evt =>{// Merge click observable stream with following observable stream..
        // Get elem no of item just clicked on
        var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));

        if(!isNaN(elemNo)) return listObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
        else return [];
      }).subscribe();
  };

  listObjectInteractivity(itemList, itemListObject$);
  listObjectInteractivity(departmentList, departmentListObject$);
  listObjectInteractivity(dayList, dayListObject$);
  listObjectInteractivity(salesList, salesListObject$);


  // ============ Stage 8 ============
  const stage8$ = new equalToObservable(8);
  stage8$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  // ============ Sum KPI ============
  const sumKPIInitial$ = appReady$.withLatestFrom(stageDebounced$)
    .map(m => m[1] >= 8 && m[1] < 11);

  const sumKPIApp$ = stageDebounced$.withLatestFrom(appReady$)
    .map(m => m[0] >= 8 && m[0] < 11);

  const sumKPI$ = Rx.Observable.merge(sumKPIInitial$, sumKPIApp$)
    .distinctUntilChanged();
  
  // Create
  sumKPI$
    .filter(f => f)
    .subscribe(() =>{
      // Create static elements
      [sumLabel, sumStaticLine, sumOutput].forEach(d3Element =>{
        d3Element
          .transition()
          .duration(750)
          .style('opacity', 1);
      });

      // Draw dynamic line
      sumDynamicLine
        .style('opacity', 1)
        .transition()
        .duration(750)
        .delay(750)
        .attr('y2', config.lists.sales.y + config.lists.radius*2.5)
    });

  // Destroy all
  sumKPI$
    .filter(f => !f)
    .subscribe(() =>{
      // Create static elements
      [sumLabel, sumStaticLine, sumDynamicLine, sumOutput].forEach(d3Element =>{
        d3Element
          .transition()
          .duration(750)
          .style('opacity', 0);
      });
    })


  // ============ Stage 9 ============
  const stage9$ = new equalToObservable(9);
  stage9$
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ============ Stage 11 ============
  const stage11$ = new greaterThanObservable(11);
  // stage$
  //   .map(stage => stage === 11)
  //   .distinctUntilChanged()
  stage11$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  // const stage11$ = stage$
  //   .map(stage => stage >= 11)
  //   .distinctUntilChanged();

  // Create
  stage11$
    .filter(f => f)
    .subscribe(() =>{
      departmentSalesTableContainer
        .transition()
        .delay(750)
        .duration(750)
        .style('opacity', 1);

      // sumTableArrow
      //   .transition()
      //   .delay(750)
      //   .duration(750)
      //   .attr('y2', 500);
    });

  // Destroy
  stage11$
    .filter(f => !f)
    .subscribe(() =>{
      departmentSalesTableContainer
        .transition()
        .duration(750)
        .style('opacity', 0);

      // sumTableArrow
      //   .transition()
      //   .duration(750)
      //   .attr('y2', config.lists.department.y);
    })

}