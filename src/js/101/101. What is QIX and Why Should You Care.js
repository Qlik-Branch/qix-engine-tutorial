import Rx from 'rxjs';
import {select as select} from 'd3';
const d3 = {select: select}

import activateSidebar from '../lib/activate-sidebar.js';
import {scrollPosition} from '../lib/scrolly-graph.js';
import connectToApp from '../lib/connect-to-app.js';

import associations from './modeling-associations/associations.js';
import multipleDataSets from './multiple-data-sets/multiple.js';

import createObjectObservables from './create-object-observables.js';

import serverConfig from '../server-config/john-server.json';
// import serverConfig from '../server-config/qlik-playground.json';
// import serverConfig from '../server-config/axis-sense-internal.json';

import '../../sass/101/101. What is QIX and Why Should You Care.scss';

activateSidebar(1);

// ========= Embed Dashboard =========
d3.select('.embed-dashboard .graph')
  .append('div')
    .classed('iframe-container', true)
  .append('iframe')
    // .attr('src', 'https://sense-demo.qlik.com/site/sense/app/ec296874-47bf-48e4-822f-0cc4e1068723/sheet/af39d324-2604-4182-b1a5-08b49898e35f/state/analysis');


// ========= Connect App =========
// Connect to app
const app$ = connectToApp(serverConfig);

const 
  objectObservables = createObjectObservables(app$),
  // dimensionHyperCubeObject$ = objectObservables.dimensionHyperCube.object$,
  // departmentListObject$ = objectObservables.departmentListObject.object$,
  // itemListObject$ = objectObservables.itemListObject.object$,
  // factHyperCubeObject$ = objectObservables.factHyperCube.object$,
  // dayListObject$ = objectObservables.dayListObject.object$,
  // salesListObject$ = objectObservables.salesListObject.object$,
  // salesSumObject$ = objectObservables.salesSumObject.object$,
  // departmentSalesHyperCubeObject$ = objectObservables.departmentSalesHyperCube.object$;
  dimensionHyperCubeLayout$ = objectObservables.dimensionHyperCube.layout$,
  departmentListLayout$ = objectObservables.departmentListObject.layout$,
  itemListLayout$ = objectObservables.itemListObject.layout$,
  factHyperCubeLayout$ = objectObservables.factHyperCube.layout$,
  dayListLayout$ = objectObservables.dayListObject.layout$,
  salesListLayout$ = objectObservables.salesListObject.layout$,
  salesSumLayout$ = objectObservables.salesSumObject.layout$,
  departmentSalesHyperCubeLayout$ = objectObservables.departmentSalesHyperCube.layout$;

/* Get all session objects to create an observable that emits when the app is ready */
// const appReady$ = dimensionHyperCubeObject$
//   .withLatestFrom(departmentListObject$)
//   .withLatestFrom(itemListObject$)
//   .withLatestFrom(factHyperCubeObject$)
//   .withLatestFrom(dayListObject$)
//   .withLatestFrom(salesListObject$)
//   .withLatestFrom(salesSumObject$)
//   .withLatestFrom(departmentSalesHyperCubeObject$)
//   .publish();
// appReady$.connect();
const appReady$ = dimensionHyperCubeLayout$
  .withLatestFrom(departmentListLayout$)
  .withLatestFrom(itemListLayout$)
  .withLatestFrom(factHyperCubeLayout$)
  .withLatestFrom(dayListLayout$)
  .withLatestFrom(salesListLayout$)
  .withLatestFrom(salesSumLayout$)
  .withLatestFrom(departmentSalesHyperCubeLayout$)
  .publish();
appReady$.connect();

associations('.modeling-associations', app$, objectObservables, appReady$);
multipleDataSets('.multiple-data-sets', app$, objectObservables, appReady$);