import activateSidebar from '../lib/activate-sidebar.js';

import aceEditor from '../lib/ace-editor.js';

import c3Generate from './code-snippets/c3-generate-editor.js';
import chartCube from './code-snippets/chart-cube-editor.js';
import chartCube2 from './code-snippets/chart-cube-2-editor.js';
import chartCube3 from './code-snippets/chart-cube-3-editor.js';
import index from './code-snippets/index-editor.js';
import index2 from './code-snippets/index-2-editor.js';
import index3 from './code-snippets/index-3-editor.js';
import index4 from './code-snippets/index-4-editor.js';
import index5 from './code-snippets/index-5-editor.js';
import index6 from './code-snippets/index-6-editor.js';
import style from './code-snippets/style-editor.js';

activateSidebar(8);

aceEditor('chart-cube-editor', 'json', chartCube, 'src/defs/chart-cube.json');
aceEditor('index-editor', 'javascript', index, 'src/index.js');
aceEditor('index-2-editor', 'javascript', index2, 'src/index.js');
aceEditor('index-3-editor', 'javascript', index3, 'src/index.js');
aceEditor('chart-cube-2-editor', 'json', chartCube2, 'src/defs/chart-cube.json');
aceEditor('c3-generate-editor', 'javascript', c3Generate, 'c3.generate function');
aceEditor('index-4-editor', 'javascript', index4, 'src/index.js');
aceEditor('index-5-editor', 'javascript', index5, 'src/index.js');
aceEditor('style-editor', 'css', style, 'style.css');
aceEditor('index-6-editor', 'javascript', index6, 'src/index.js');
aceEditor('chart-cube-3-editor', 'json', chartCube3, 'src/d3s/chart-cube.json');