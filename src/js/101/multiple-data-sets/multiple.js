import Rx from 'rxjs';

import multipleHtml from './multiple-html.js';
import multipleStageObservable from './multiple-stage-observable.js';
import paintTable from '../paint-table.js';
import paintDynamicTable from '../paint-dynamic-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';

export default function(sectionClass, app$, objectObservables){
  var altColor = '#BEBEBE';
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
    dayLabel = htmlSetup.lists.dayLabel,
    salesLabel = htmlSetup.lists.salesLabel,
    bottomArrow = htmlSetup.arrows.bottomArrow,
    bottomArrowBase = htmlSetup.arrows.bottomArrowBase,
    sumTableArrow = htmlSetup.arrows.sumTableArrow,
    sumLabel = htmlSetup.sum.label,
    sumStaticLine = htmlSetup.sum.staticLine,
    sumDynamicLine = htmlSetup.sum.dynamicLine,
    sumOutput = htmlSetup.sum.output,
    sumOutputValue = htmlSetup.sum.outputValue,
    config = htmlSetup.config;

  const dimensionHyperCubeLayout$ = objectObservables.dimensionHyperCube.layout$,
    factHyperCubeLayout$ = objectObservables.factHyperCube.layout$,
    departmentListObject$ = objectObservables.departmentListObject.object$,
    itemListObject$ = objectObservables.itemListObject.object$,
    departmentListLayout$ = objectObservables.departmentListObject.layout$,
    itemListLayout$ = objectObservables.itemListObject.layout$,
    dayListObject$ = objectObservables.dayListObject.object$,
    dayListLayout$ = objectObservables.dayListObject.layout$,
    salesListObject$ = objectObservables.salesListObject.object$,
    salesListLayout$ = objectObservables.salesListObject.layout$,
    salesSumLayout$ = objectObservables.salesSumLayout$,
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


  // ============ Observables ============
  const stage$ = multipleStageObservable(sectionClass, app$);

  // stage$.subscribe(stage =>{
  //   console.log(stage);
  // });

  
  // ============ Subscribe ============
  // Dimension HyperCube
  dimensionHyperCubeLayout$.subscribe(layout =>{
    paintTable(dimensionTable, layout);
  });


  // Fact HyperCube
  factHyperCubeLayout$.subscribe(layout =>{
    paintTable(factTable, layout);
  });


  // Department Sales HyperCube
  departmentSalesHyperCubeLayout$.subscribe(layout =>{
    paintDynamicTable(departmentSalesTable, layout);
  })


  // Department ListObject
  departmentListLayout$.subscribe(qMatrix =>{
    paintListValues(departmentList, qMatrix, -Math.PI/2, altColor);
  });


  // Item ListObject
  itemListLayout$.subscribe(qMatrix =>{
    paintListValues(itemList, qMatrix, -Math.PI/4, altColor);
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


  // ============ Stage 3 ============
  const stage1$ = stage$
    .map(stage => stage >= 1)
    .distinctUntilChanged();

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
  const stage2$ = stage$
    .map(stage => stage >= 2)
    .distinctUntilChanged();

  // Clear All and Create Bottom Connector
  stage2$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe(() =>{
      bottomArrow
        .transition()
        .duration(750)
        .attr('x2', 273);

      [bottomRect, bottomArrowBase, dayLabel, salesLabel].forEach(d3Element =>{
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
      paintListContainer(dayList, [1], listContainerRadius);
      paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor);
    });

  // Create Sales List
  salesListLayout$
    .withLatestFrom(stage2$)
    .filter(f => f[1])
    .pluck('0')
    .subscribe(qMatrix =>{
      paintListContainer(salesList, [1], listContainerRadius);
      paintListValues(salesList, qMatrix, Math.PI/6, altColor);
    });

  // Destroy All
  stage2$
    .filter(f => !f)
    .subscribe(() => {
      bottomArrow
        .transition()
        .duration(750)
        .attr('x2', config.lists.item.x - 4);

      [bottomRect, bottomArrowBase, dayLabel, salesLabel].forEach(d3Element =>{
        d3Element
          .transition()
          .duration(750)
          .style('opacity', 0);
      });

      // Destroy Day List Object
      paintListContainer(dayList, [], listContainerRadius);
      paintListValues(dayList, [], Math.PI*(3/4), altColor);

      // Destroy Sales List Object
      paintListContainer(salesList, [], listContainerRadius);
      paintListValues(salesList, [], Math.PI/6, altColor);
    });


  // ============ Stage 3 ============
  stage$
    .map(stage => stage === 3)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();
    
    
  // ============ Stage 4 ============
  stage$
    .map(stage => stage === 4)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();


  // ============ Stage 5 ============
  stage$
    .map(stage => stage === 5)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ============ Interactivity ============
  function listObjectInteractivity(list, listObject$){
    Rx.Observable.fromEvent(list._groups[0][0], 'click')
      .withLatestFrom(stage$)
      .filter(f => [6, 10, 12].indexOf(f[1]) != -1)
      .pluck('0')
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
  stage$
    .map(stage => stage === 8)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  // ============ Sum KPI ============
  const sumKPI$ = stage$
    .map(stage => stage >= 8 && stage < 11)
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
  stage$
    .map(stage => stage === 9)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ============ Stage 11 ============
  stage$
    .map(stage => stage === 11)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  const stage11$ = stage$
    .map(stage => stage >= 11)
    .distinctUntilChanged();

  // Create
  stage11$
    .filter(f => f)
    .subscribe(() =>{
      departmentSalesTableContainer
        .transition()
        .delay(750)
        .duration(750)
        .style('opacity', 1);

      sumTableArrow
        .transition()
        .delay(750)
        .duration(750)
        .attr('y2', 500);
    });

  // Destroy
  stage11$
    .filter(f => !f)
    .subscribe(() =>{
      departmentSalesTableContainer
        .transition()
        .duration(750)
        .style('opacity', 0);

      sumTableArrow
        .transition()
        .duration(750)
        .attr('y2', (config.lists.day.y + config.lists.item.y)*.525 + 4);
    })

}