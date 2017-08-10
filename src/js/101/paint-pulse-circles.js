import * as d3 from 'd3';

import '../../imgs/light-checkmark.png';
import '../../imgs/dark-checkmark.png';

export default function(list, data, offset){
  const circleContainerRadius = 48.6;
  const theta = 2*Math.PI/data.length;

  // =========== Highlight Circles ===========
  // attach data
  const updateHighlight = list.selectAll('.highlight-circle')
    .interrupt()
    .data(data);

  // Enter new
  const enterHighlight = updateHighlight
    .enter()
    .append('circle')
    .attr('class', 'highlight-circle')
    .attr('cx', (d, i) => (circleContainerRadius*.6)*Math.cos(i*theta + offset))
    .attr('cy', (d, i) => (circleContainerRadius*.6)*Math.sin(i*theta + offset))
    .attr('r', 11);
}