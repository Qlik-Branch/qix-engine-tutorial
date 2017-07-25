import * as d3 from 'd3';
import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import genericObjectJson from './code-snippets/generic-object.js';

activateSidebar(2);

aceEditor('generic-object', 'javascript', genericObjectJson, 'Generic Object');
const genericObjectLines = d3.selectAll('.ace_line');
