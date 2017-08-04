import Clipboard from 'clipboard';
import * as d3 from 'd3';
import '../../../node_modules/ace-builds/src-min-noconflict/ace.js';
import '../../../node_modules/ace-builds/src-min-noconflict/mode-json.js';
import '../../../node_modules/ace-builds/src-min-noconflict/mode-javascript.js';
import '../../../node_modules/ace-builds/src-min-noconflict/mode-css.js';
import '../../../node_modules/ace-builds/src-min-noconflict/mode-html.js';
import '../../../node_modules/ace-builds/src-min-noconflict/theme-tomorrow_night.js';

export default function aceEditor(section, language, text, filename){
  // Get count of total previous editors
  const previousEditors = document.querySelectorAll('.' +section +' .editor-container .tab-pane').length;

  // Get .graph div
  const editorGraph = d3.select('.' +section +' .graph');

  // Check if already tabs
  if(previousEditors > 0) addTab();
  else createTab();


  var editor = ace.edit(section +'-embed-' +previousEditors);
  editor.getSession().setMode('ace/mode/' +language);
  editor.$blockScrolling = Infinity;
  editor.session.setUseWorker(false);
  editor.session.setOptions({
    tabSize: 2,
    useSoftTabs: true
  })
  editor.setTheme('ace/theme/tomorrow_night')
  editor.setReadOnly(true);
  editor.setValue(text)
  editor.clearSelection();
  // editor.resize();
  editor.setFadeFoldWidgets(true);

  const lineCount = editor.session.doc.getAllLines().length;

  d3.select('#' +section +'-embed-' +previousEditors)
    .style('height', 16*(lineCount + 3) +'px');

  editorGraph.select('.editor-container .tab-content .ace_editor:last-of-type')
    .append('div')
    .attr('class', 'copy-button')
    .attr('data-clipboard-text', editor.getValue())
    .attr('data-toggle', 'tooltip')
    .attr('title', 'copied')
    .html('Copy');

  $(document).ready(function(){
    $('.copy-button').tooltip({
      trigger: 'click'
    })
  })

  var clipboard = new Clipboard('.copy-button');
  clipboard.on('success', function(){
    setTimeout(function(){
      $('.copy-button').tooltip('hide');
    }, 1000);
  })

  // Create Tabs
  function createTab(){
    // HTML string of nav tabs
    const navTabsString =
      `<ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#${section}-embed-${previousEditors}">${filename}</a></li>
      </ul>
      <div class="tab-content"></div>
    `;

    // Create element to contain nav tabs and editor
    const editorContainer = editorGraph
      .append('div')
        .attr('class', 'editor-container')
        .html(navTabsString);

    editorContainer.select('.tab-content')
      .append('div')
      .attr('id', section +'-embed-' +previousEditors)
      .attr('class', 'tab-pane fade in active');
  }


  // Add Tabs
  function addTab(){
    d3.select('.' +section +' .graph .editor-container .nav-tabs')
      .append('li')
      .append('a')
        .attr('data-toggle', 'tab')
        .attr('href', `#${section}-embed-${previousEditors}`)
        .html(filename)

    d3.select('.' +section +' .graph .editor-container .tab-content')
      .append('div')
      .attr('id', section +'-embed-' +previousEditors)
      .attr('class', 'tab-pane fade');

    d3.select('.' +section +` .graph .editor-container .tab-content #${section}-embed-${previousEditors}`)
      .append('div')
      .attr('id', section +'-embed-' +previousEditors)
      .attr('class', 'tab-pane fade');
  }
}