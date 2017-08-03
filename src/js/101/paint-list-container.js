import * as d3 from 'd3';

export default function(circle, data, radius){
  const update = circle.selectAll('.container-circle')
    .interrupt()
    .data(data)


  update.enter()
      .append('circle')
      .attr('class', 'container-circle')
      .attr('r', 0)
    .merge(update)
      .transition()
      .duration(750)
      .attr('r', radius)


  update.exit()
    .classed('container-exiting', true)
    .transition()
    .delay(500)
    .duration(750)
    .attr('r', 0)
    .remove();

}