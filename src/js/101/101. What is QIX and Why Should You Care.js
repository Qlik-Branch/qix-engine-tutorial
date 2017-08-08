import Rx from 'rxjs';

import activateSidebar from '../lib/activate-sidebar.js';
import {scrollPosition} from '../lib/scrolly-graph.js';
import connectToApp from '../lib/connect-to-app.js';

import associations from './modeling-associations/associations.js';
import multipleDataSets from './multiple-data-sets/multiple.js';

import createObjectObservables from './create-object-observables.js';

// import serverConfig from '../server-config/john-server.json';
import serverConfig from '../server-config/qlik-playground.json';
// import serverConfig from '../server-config/axis-sense-internal.json';

import '../../sass/101/101. What is QIX and Why Should You Care.scss';

activateSidebar(1);

// Connect to app
// Local
const app$ = connectToApp(serverConfig, '76928257-797b-4702-8ff9-558d4b467a41');
// Playground
// const app$ = connectToApp(serverConfig, 'a8ec5b10-9fee-4f72-ba5e-e1aebe76e8d2');

const objectObservables = createObjectObservables(app$);

associations('.modeling-associations', app$, objectObservables);
multipleDataSets('.multiple-data-sets', app$, objectObservables);