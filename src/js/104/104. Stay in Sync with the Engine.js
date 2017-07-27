import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import selectRequest from './code-snippets/select-request.js';
import selectResponse from './code-snippets/select-response.js';
import getLayout from './code-snippets/get-layout.js';

activateSidebar(4);

aceEditor('select-request', 'json', selectRequest, 'Apply Selection');
aceEditor('select-response', 'json', selectResponse, 'Get Response');
aceEditor('get-layout', 'json', getLayout, 'Get Layout');