import * as d3 from 'd3';
import activateSidebar from '../lib/activate-sidebar.js';

import aceEditor from '../lib/ace-editor.js';

import resourceList from './resources/resource-list.js';

import loadEnigmaJs from './code-snippets/load-enigmajs.js';
import enigmaConfig from './code-snippets/enigma-config.js';
import engineConnect from './code-snippets/engine-connect.js';
import openDoc from './code-snippets/open-doc.js';

activateSidebar(6);

d3.select('.resource-list .graph')
  .html(resourceList);

aceEditor('load-enigmajs', 'javascript', loadEnigmaJs, 'src/index.js');
aceEditor('enigma-config', 'javascript', enigmaConfig, 'src/index.js');
aceEditor('engine-connect', 'javascript', engineConnect, 'src/index.js');
aceEditor('open-doc', 'javascript', openDoc, 'src/index.js');