import Rx from 'rxjs';

import activateSidebar from '../lib/activate-sidebar.js';
import {scrollPosition} from '../lib/scrolly-graph.js';
import connectToApp from '../lib/connect-to-app.js';

import serverConfig from '../server-config/john-server.json';
import associationsHtml from './associations-html.js';
import associationsStageObservable from './associations-stage-observable.js';
import associationsAppObjects from './associations-app-objects.js';
import associationsPaintTable from './associations-paint-table.js';
import associationsPaintListContainer from './associations-paint-list-container.js';
import associationsPaintListValues from './associations-paint-list-values.js';
// import modelingAssociations from './modeling-associations.js';

import '../../sass/101/101. What is QIX and Why Should You Care.scss';

activateSidebar(1);

const scrollList = [
];

scrollPosition(scrollList);


// ============ Modeling Associations ============
// Initialize Modeling Associations HTML
const html = associationsHtml('.modeling-associations');
const paragraphs = html.elements;

// Create paragraph and stage observables
const [paragraphSubject, stageSubject] = associationsStageObservable('.modeling-associations', html);

// update paragraph display using paragraph observable
paragraphSubject.subscribe(paragraph =>{
  paragraphs.classed('hidden', (d, i) => paragraph != +paragraphs._groups[0][i].getAttribute('element-group'));
})

// Get app observable;
const app$ = connectToApp(serverConfig, '76928257-797b-4702-8ff9-558d4b467a41');

// Get app object observables
const [hyperCube$, itemListObject$, departmentListObject$] = associationsAppObjects(app$);

// Subscribe to hyperCube layout
hyperCube$.qLayouts()
  .subscribe(layout =>{
    // Get data
    const headerData = layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}});
    const bodyData = layout.qHyperCube.qDataPages[0].qMatrix;

    // Paint Table
    associationsPaintTable(html.tableHeader, headerData, html.tableBody, bodyData);
  });

stageSubject.subscribe(stage =>{
  console.log('stage: ', stage);
});

// State of Item ListObject
var subscribeToItemList = false,
    subscribeToDepartmentList = false;

/* Item List Object observable will call the paint function whenever the list object updates */
itemListObject$.qLayouts()
  .filter(() => subscribeToItemList)
  .map((layout, i) => {
    return layout.qListObject.qDataPages[0].qMatrix.map(d =>{
      d[0].index = i;
      return d;
    });
  })
  .subscribe(qMatrix =>{
    associationsPaintListValues(html.itemList, qMatrix, -Math.PI/4);
  });


// Stage Observables
const destroyItemListObject = stageSubject
  .filter(stage => stage === 0)
  .do(() =>{
    var itemListData = [];
    associationsPaintListContainer(html.itemList, []);
    subscribeToItemList = false;
    associationsPaintListValues(html.itemList, [], -Math.PI/4);
  })

const paintItemListObject = stageSubject
  .filter(stage => stage === 1)
  .mergeMap((stage, i) => {
    var itemListData = [i];
    associationsPaintListContainer(html.itemList, itemListData);
    subscribeToItemList = true;
    return app$.qClearAll();
  });

  
// Merge all stages
const mergedStages = Rx.Observable.merge(
  destroyItemListObject,
  paintItemListObject
);

// Once app$ emits something, switch to merged observables
app$.switchMap(() => mergedStages).subscribe();