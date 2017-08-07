import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import '../../sass/104/104. Stay in Sync with the Engine.scss';

import interactiveValidation from './interactive-validation.js';

import selectRequest from './code-snippets/select-request.js';
import selectResponse from './code-snippets/select-response.js';
import getLayout from './code-snippets/get-layout.js';

activateSidebar(4);

interactiveValidation('.interactive-validation');

aceEditor('select-request', 'json', selectRequest, 'Apply Selection');
aceEditor('select-response', 'json', selectResponse, 'Get Response');
aceEditor('get-layout', 'json', getLayout, 'Get Layout');