import Rx from 'rxjs';

import activateSidebar from '../lib/activate-sidebar.js';
import {scrollPosition} from '../lib/scrolly-graph.js';
import connectToApp from '../lib/connect-to-app.js';

import associations from './modeling-associations/associations.js';
import multipleDataSets from './multiple-data-sets/multiple.js';

import createObjectObservables from './create-object-observables.js';

import serverConfig from '../server-config/john-server.json';

import '../../sass/101/101. What is QIX and Why Should You Care.scss';

activateSidebar(1);


// Connect to app
const app$ = connectToApp(serverConfig, '76928257-797b-4702-8ff9-558d4b467a41');

const objectObservables = createObjectObservables(app$);

associations('.modeling-associations', app$, objectObservables);
multipleDataSets('.multiple-data-sets', app$, objectObservables);