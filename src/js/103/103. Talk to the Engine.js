import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import '../../sass/103/103. Talk to the Engine.scss';

import jsonRPCRequest from './code-snippets/json-rpc-request.js';
import jsonRPCResponse from './code-snippets/json-rpc-response.js';
import jsonRPCNotification from './code-snippets/json-rpc-notification.js';
import engineVersionRequest from './code-snippets/engine-version-request.js';
import engineVersionResponse from './code-snippets/engine-version-response.js';

import openDocRequest from './code-snippets/open-doc-request.js';
import openDocResponse from './code-snippets/open-doc-response.js';
import getFieldRequest from './code-snippets/get-field-request.js';
import getFieldResponse from './code-snippets/get-field-response.js';
import getCardinalRequest from './code-snippets/get-cardinal-request.js';
import getCardinalResponse from './code-snippets/get-cardinal-response.js';

import apiConnect from './code-snippets/api-connect.js';
import apiEngineVersionRequest from './code-snippets/api-engine-version-request.js';
import apiEngineVersionResponse from './code-snippets/api-engine-version-response.js';
import apiEndToEnd from './code-snippets/api-end-to-end.js';

activateSidebar(3);

aceEditor('json-rpc-request', 'json', jsonRPCRequest, 'JSONRPC Request');
aceEditor('json-rpc-response', 'json', jsonRPCResponse, 'JSONRPC Response');
aceEditor('json-rpc-notification', 'json', jsonRPCNotification, 'JSONRPC Notification');
aceEditor('engine-version-request', 'json', engineVersionRequest, 'Engine Version Request');
aceEditor('engine-version-response', 'json', engineVersionResponse, 'Engine Version Response');

aceEditor('get-cardinal', 'json', openDocRequest, 'Open Doc Request');
aceEditor('get-cardinal', 'json', openDocResponse, 'Open Doc Response');
aceEditor('get-cardinal', 'json', getFieldRequest, 'Get Field Request');
aceEditor('get-cardinal', 'json', getFieldResponse, 'Get Field Response');
aceEditor('get-cardinal', 'json', getCardinalRequest, 'Get Cardinal Request');
aceEditor('get-cardinal', 'json', getCardinalResponse, 'Get Cardinal Response');

aceEditor('api-call', 'javascript', apiConnect, 'Connect To Engine');
aceEditor('api-call', 'javascript', apiEngineVersionRequest, 'Request Engine Version');
aceEditor('api-call', 'javascript', apiEngineVersionResponse, 'Engine Version Response');
aceEditor('api-call', 'javascript', apiEndToEnd, 'End To End');