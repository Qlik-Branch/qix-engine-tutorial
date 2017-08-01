import Rx from 'rxjs';

import multipleHtml from './multiple-html.js';
import multipleStageObservable from './multiple-stage-observable.js';
import paintTable from '../paint-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';

export default function(sectionClass, app$, objectObservables){
  var altColor = '#686868';

  // ============ HTML Setup ============
  const htmlSetup = multipleHtml(sectionClass),
        d3Paragraphs = htmlSetup.d3Paragraphs,
        dimensionTableContainer = htmlSetup.dimensionTable.container,
        dimensionTable = htmlSetup.dimensionTable,
        factTableContainer = htmlSetup.factTable.container,
        factTable = htmlSetup.factTable,
        departmentList = htmlSetup.lists.department,
        itemList = htmlSetup.lists.item,
        dayList = htmlSetup.lists.day,
        salesList = htmlSetup.lists.sales;


  // ============ Observables ============
  const stage$ = multipleStageObservable(sectionClass);

  stage$.subscribe(stage =>{
    console.log(stage);
  });

  
  // ============ Subscribe ============
  // Dimension HyperCube
  objectObservables.dimensionHyperCube.layout$.subscribe(layout =>{
    paintTable(dimensionTable, layout);
  });

  // Fact HyperCube
  objectObservables.factHyperCube.layout$.subscribe(layout =>{
    paintTable(factTable, layout);
  });

  // Department ListObject
  objectObservables.departmentListObject.layout$
    .map(qMatrix =>{
      return qMatrix.map(d =>{
        d[0].index = 0;
        return d;
      })
    })
    .subscribe(qMatrix =>{
      paintListValues(departmentList, qMatrix, -Math.PI/2, altColor);
    });

  // Item ListObject
  objectObservables.itemListObject.layout$
    .map(qMatrix =>{
      return qMatrix.map(d =>{
        d[0].index = 0;
        return d;
      })
    })
    .subscribe(qMatrix =>{
      paintListValues(itemList, qMatrix, -Math.PI/4, altColor);
    });

  // Day ListObject
  objectObservables.dayListObject.layout$
    .map(qMatrix =>{
      return qMatrix.map(d =>{
        d[0].index = 0;
        return d;
      })
    })
    .subscribe(qMatrix =>{
      paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor);
    });

  // Sales ListObject
  objectObservables.salesListObject.layout$
    .map(qMatrix =>{
      return qMatrix.map(d =>{
        d[0].index = 0;
        return d;
      })
    })
    .subscribe(qMatrix =>{
      paintListValues(salesList, qMatrix, Math.PI/6, altColor);
    });



  // ============ Stages ============
  // ***** 0 *****
  const destroyFactTable = stage$
    .filter(stage => stage === 0)
    .do(() =>{
      factTableContainer
        .transition()
        .duration(750)
        .style('opacity', 0);
    })

  // ***** 1 *****
  const paintFactTable = stage$
    .filter(stage => stage === 1)
    .mergeMap(() =>{
      factTableContainer
        .transition()
        .duration(750)
        .style('opacity', 1);

      return app$.qClearAll();
    })


  const mergedStages = Rx.Observable.merge(
    destroyFactTable,
    paintFactTable
  );

  // Subscribe to app$
  app$.switchMap(() => mergedStages).subscribe();
}