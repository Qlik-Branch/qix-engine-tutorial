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

const objectObservables = createObjectObservables(app$);

associations('.modeling-associations', app$, objectObservables);
multipleDataSets('.multiple-data-sets', app$, objectObservables);