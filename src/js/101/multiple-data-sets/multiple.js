import Rx from 'rxjs';

import multipleHtml from './multiple-html.js';
import multipleStageObservable from './multiple-stage-observable.js';
import multiplePaintTable from './multiple-paint-table.js';

export default function(sectionClass, app$, objectObservables){
  // ============ HTML Setup ============
  const htmlSetup = multipleHtml(sectionClass);
  const d3Paragraphs = htmlSetup.d3Paragraphs;
  const dimensionTable = htmlSetup.dimensionTable;
  const factTable = htmlSetup.factTable;


  // ============ Observables ============
  const stage$ = multipleStageObservable(sectionClass);

  stage$.subscribe(stage =>{
    console.log(stage);
  });

  
  // ============ Subscribe ============
  objectObservables.dimensionHyperCube.layout$.subscribe(layout =>{
    multiplePaintTable(dimensionTable, layout);
  });

  objectObservables.factHyperCube.layout$.subscribe(layout =>{
    multiplePaintTable(factTable, layout);
  })


  const mergedStages = Rx.Observable.merge();

  // Subscribe to app$
  app$.switchMap(() => mergedStages).subscribe();
}