import Rx from 'rxjs';

import multipleHtml from './multiple-html.js';
import multipleStageObservable from './multiple-stage-observable.js';
import paintTable from '../paint-table.js';
import paintListContainer from '../paint-list-container.js';
import paintListValues from '../paint-list-values.js';

export default function(sectionClass, app$, objectObservables){
  var altColor = '#686868';
  const listContainerRadius = 48.6;

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
        salesList = htmlSetup.lists.sales,
        bottomRect = htmlSetup.rects.bottom;


  // ============ Observables ============
  const stage$ = multipleStageObservable(sectionClass);

  // stage$.subscribe(stage =>{
  //   console.log(stage);
  // });

  
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
  // var dayListIndex = 0;
  // Rx.Observable
  //   .combineLatest(
  //     objectObservables.dayListObject.layout$,
  //     stage$
  //   )
  //   .filter(f => f[1] > 1)
  //   .pluck('0')
  //   .map(qMatrix =>{
  //     return qMatrix.map(d =>{
  //       d[0].index = dayListIndex;
  //       return d;
  //     })
  //   })
  //   .subscribe(qMatrix =>{
  //     console.log(qMatrix);
  //     paintListContainer(dayList, [dayListIndex], listContainerRadius);
  //     paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor);
  //   });


  // // Sales ListObject
  // var salesListIndex = 0;
  // Rx.Observable
  //   .combineLatest(
  //     objectObservables.salesListObject.layout$,
  //     stage$
  //   )
  //   .filter(f => f[1] > 1)
  //   .pluck('0')
  //   .map(qMatrix =>{
  //     return qMatrix.map(d =>{
  //       d[0].index = salesListIndex;
  //       return d;
  //     })
  //   })
  //   .subscribe(qMatrix =>{
  //     paintListContainer(salesList, [salesListIndex], listContainerRadius);
  //     paintListValues(salesList, qMatrix, Math.PI/6, altColor);
  //   });


  // Bottom Connector
  const [afterStage1, beforeStage1] = stage$
    .map(stage => stage > 1)
    .distinctUntilChanged()
    // .map((stage2, i) => {
    //   return {
    //     stage2: stage2,
    //     index: i
    //   }
    // })
    .publish()
    .refCount()
    .partition(stage => stage);

  // ===== After ====
  afterStage1
    .subscribe(() =>{
      bottomRect
        .transition()
        .duration(750)
        .style('opacity', 1);

    });

  Rx.Observable
    .combineLatest(
      objectObservables.dayListObject.layout$,
      afterStage1
    )
    .pluck('0')
    .subscribe(qMatrix =>{
      paintListContainer(dayList, [1], listContainerRadius);
      paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor);
    })


  // ==== Before ====
  beforeStage1
    .subscribe(() =>{
      bottomRect
        .transition()
        .duration(750)
        .style('opacity', 0);
    })

  Rx.Observable
    .combineLatest(
      objectObservables.dayListObject.layout$,
      beforeStage1
    )
    .pluck('0')
    .subscribe(qMatrix =>{
      paintListContainer(dayList, [], listContainerRadius);
      paintListValues(dayList, [], Math.PI*(3/4), altColor);
    })


  // stage2Stream
  //   .subscribe(out =>{
  //     console.log(out);
  //   })
  
  // Rx.Observable
  //   .combineLatest(
  //     objectObservables.dayListObject.layout$,
  //     stage2Stream
  //   )
  //   .map(m =>{
  //     // console.log(m[1].index);
  //     m[0] = m[0].map(d =>{
  //       d[0].index = m[1].index;
  //       return d;
  //     });

  //     return m;
  //   })
  //   // .filter(f => f[1].stage2)
  //   // .pluck('0')
  //   .subscribe(result =>{
  //     // console.log(result[0][0][0].index);
  //     if(result[1].stage2){
  //       console.log('build');
  //       paintListContainer(dayList, [result[1].index], listContainerRadius);
  //       paintListValues(dayList, result[0], Math.PI*(3/4), altColor);

  //       // app$.qClearAll().take(1).subscribe()
  //     } else{
  //       console.log('erase');
  //       paintListContainer(dayList, [], listContainerRadius);
  //       paintListValues(dayList, [], Math.PI*(3/4), altColor);
  //     }
  //   })

  // Rx.Observable
  //   .combineLatest(
  //     objectObservables.dayListObject.layout$,
  //     stage2Stream
  //   )
  //   .filter(f => f[1].stage2)
  //   .map(m =>{
  //     return m[0].map(d =>{
  //       d[0].index = m[1].index;
  //       return d;
  //     })
  //   })
  //   .subscribe(qMatrix =>{
  //     bottomRect
  //       .transition()
  //       .duration(750)
  //       .style('opacity', 1);

  //     paintListContainer(dayList, [qMatrix[0][0].index], listContainerRadius);
  //     paintListValues(dayList, qMatrix, Math.PI*(3/4), altColor);
  //   })


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
  // const paintFactTable = stage$
  //   .filter(stage => stage === 1)
  //   .mergeMap(() =>{
  //     factTableContainer
  //       .transition()
  //       .duration(750)
  //       .style('opacity', 1);

  //     // dayListIndex++;
  //     // salesListIndex++;
  //     paintListContainer(dayList, [], listContainerRadius);
  //     paintListContainer(salesList, [], listContainerRadius);
  //     paintListValues(dayList, [], Math.PI*(3/4), altColor);
  //     paintListValues(salesList, [], Math.PI/6, altColor);

  //     return app$.qClearAll();
  //   });

  


  const mergedStages = Rx.Observable.merge(
    destroyFactTable,
    // paintFactTable
  );

  // Subscribe to app$
  app$.switchMap(() => mergedStages).subscribe();
}