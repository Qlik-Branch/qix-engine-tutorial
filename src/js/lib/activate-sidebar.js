import {select, selectAll} from 'd3-selection';

export default function activateSidebar(chapter){
  var chapter = select('#sidebar .nav-sidebar .chapter-' +chapter) // Get chapter
    .classed('active', true); // Set to active class

  chapter.select('.sub-sidebar') // Get sub-sidebar
    .classed('active', true); // Set to active class
  
  chapter.select('.glyphicon') // Get glyphicon
    .classed('glyphicon-menu-right', false) // Remove menu-right-glyphicon
    .classed('glyphicon-menu-down', true); // Add menu-down-glyphicon

  // Add h2- id to each h2 for anchoring
  selectAll('#body-content h2')
    .attr('id', (d, i) =>{return 'h2-' +i});
}