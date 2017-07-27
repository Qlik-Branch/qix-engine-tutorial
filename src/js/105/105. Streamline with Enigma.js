import activateSidebar from '../lib/activate-sidebar.js';
import aceEditor from '../lib/ace-editor.js';

import enigmaCreateSession from './code-snippets/enigma-create-session.js';
import sessionOpen from './code-snippets/session-open.js';
import getCardinal from './code-snippets/get-cardinal.js';
import engineConfig from './code-snippets/engine-config.js';
import onChange from './code-snippets/on-change.js';
import getGenericObject from './code-snippets/get-generic-object.js';
import getLayout from './code-snippets/get-layout.js';

activateSidebar(5);

aceEditor('enigma-create-session', 'javascript', enigmaCreateSession, 'Create Session');
aceEditor('session-open', 'javascript', sessionOpen, 'Open Session');
aceEditor('get-cardinal', 'javascript', getCardinal, 'Distinct Values');
aceEditor('engine-config', 'javascript', engineConfig, 'engine-config');
aceEditor('on-change', 'javascript', onChange, 'Change Handler');
aceEditor('get-generic-object', 'javascript', getGenericObject, 'Get Generic Object');
aceEditor('get-layout', 'javascript', getLayout, 'Get Layout');