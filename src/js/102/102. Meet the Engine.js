import * as d3 from 'd3';
import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import '../../sass/102/102. Meet the Engine.scss';

import genericObjectJson from './code-snippets/generic-object.js';

import staticDynPropDiagram from './static-dyn-prop-diagram.js';

activateSidebar(2);

// Add ace editor
aceEditor('generic-object', 'javascript', genericObjectJson, 'Generic Object');


// Create Property diagram
staticDynPropDiagram('.static-dyn-prop-diagram');