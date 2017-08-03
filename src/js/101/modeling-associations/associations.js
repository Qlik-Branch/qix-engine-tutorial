import Rx from 'rxjs';
import * as d3 from 'd3';

import associationsHtml from './associations-html.js';
import associationsStageObservable from './associations-stage-observable.js';
import paintTable from '../paint-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';

export default function(sectionClass, app$, objectObservables){
  // ============ Global Variables ============
  var altColor = '#686868';
  // var selectionActive = false;
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

  const dimensionHyperCubeLayout$ = objectObservables.dimensionHyperCube.layout$,
    departmentListObject$ = objectObservables.departmentListObject.object$,
    itemListObject$ = objectObservables.itemListObject.object$,
    departmentListLayout$ = objectObservables.departmentListObject.layout$,
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



  // ============ Observables ============
  const stage$ = associationsStageObservable(sectionClass);
  stage$.subscribe(s => console.log(s));

  // ============ Subscribe ============
  // Dimension HyperCube
  dimensionHyperCubeLayout$.subscribe(layout =>{
    paintTable(dimensionTable, layout);
  });
  

  // ***** Stage 1 *****
  const stage1$ = Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] >= 1)
    .distinctUntilChanged();

  stage1$
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();

  itemListLayout$
    .withLatestFrom(stage1$)
    .filter(f => f[1])
    .pluck('0')
    .do(qMatrix =>{
      paintListContainer(itemList, [1], circleContainerRadius);
      paintListValues(itemList, qMatrix, Math.PI/4, altColor);
    })
    .subscribe();

  stage1$
    .filter(f => !f[0])
    .do(() =>{
      paintListContainer(itemList, [], circleContainerRadius);
      paintListValues(itemList, [], Math.PI/4, altColor);
    })
    .subscribe();

  
  // ***** Stage 2 *****
  const stage2$ = Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] >= 2)
    .distinctUntilChanged();

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
      paintListContainer(departmentList, [1], circleContainerRadius);
      paintListValues(departmentList, qMatrix, Math.PI/6, altColor);
    })
    .subscribe();

  // Destroy list objects
  stage2$
    .filter(f => !f)
    .do(() =>{
      paintListContainer(departmentList, [], circleContainerRadius);
      paintListValues(departmentList, [], Math.PI/6, altColor);
    })
    .subscribe();


  // ***** Stage 3 *****
  const stage3$ = Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] >= 3)
    .distinctUntilChanged();

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
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 4)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();


  // ***** Stage 5 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 5)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectClothing())
    .subscribe();


  // ***** Stage 6 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 6)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectClothingTShirt())
    .subscribe();


  // ***** Stage 7 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 7)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => clearAll())
    .subscribe();


  // ***** Stage 8 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 8)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();

  
  // ***** Stage 9 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 9)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectTShirtCameraClothing())
    .subscribe();


  // ***** Stage 10 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 10)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();
    

  // ***** Stage 11 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 11)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectFurniture())
    .subscribe();
    

  // ***** Stage 12 *****
  Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] === 12)
    .distinctUntilChanged()
    .filter(f => f)
    .mergeMap(() => selectTShirtCamera())
    .subscribe();


  // ***** Stage 13 *****
  const stage13$ = Rx.Observable.combineLatest(app$, stage$)
    .map(m => m[1] >= 13)
    .distinctUntilChanged();

  stage13$
    .filter(f => f)
    .withLatestFrom(itemListLayout$)
    .pluck('1')
    .subscribe(qMatrix =>{
      altColor = '#BEBEBE';
      paintListValues(itemList, qMatrix, Math.PI/4, altColor);
    });

  stage13$
    .filter(f => !f)
    .subscribe(() =>{
      altColor = '#686868';
    });

  
  // ***** Stage 14 *****
  Rx.Observable.fromEvent(itemList._groups[0][0], 'click')
    .withLatestFrom(stage$)
    .filter(f => f[1] >= 14)
    .pluck('0')
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
    .mergeMap(evt =>{// Merge click observable stream with following observable stream..
      // Get elem no of item just clicked on
      var elemNo = parseInt(evt.target.getAttribute('data-qelemno'));

      if(!isNaN(elemNo)) return departmentListObject$.qSelectListObjectValues('/qListObjectDef', [elemNo], true);
      else return [];
    }).subscribe();
}