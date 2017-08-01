import Rx from 'rxjs';

import activateSidebar from '../lib/activate-sidebar.js';
import {scrollPosition} from '../lib/scrolly-graph.js';

import associations from './modeling-associations/associations.js';

import '../../sass/101/101. What is QIX and Why Should You Care.scss';

activateSidebar(1);

const scrollList = [
];

scrollPosition(scrollList);

associations('.modeling-associations');
