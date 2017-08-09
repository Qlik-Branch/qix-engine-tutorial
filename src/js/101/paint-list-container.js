import * as d3 from 'd3';

export default function(circle, data, radius, label, labelY){
  // ========== Circle ==========
  const circleUpdate = circle.selectAll('.container-circle')
    .interrupt()
    .data(data)


  circleUpdate.enter()
      .append('circle')
      .attr('class', 'container-circle')
      .attr('r', 0)
    .merge(circleUpdate)
      .transition()
      .duration(750)
      .attr('r', radius)


  circleUpdate.exit()
    .transition()
    .delay(500)
    .duration(750)
    .attr('r', 0)
    .remove();


  // ========== Label ==========
  const labelUpdate = circle.selectAll('.container-label')
    .interrupt()
    .data(data);

  
  labelUpdate
    .enter()
      .append('text')
      .attr('class', 'container-label')
      .text(label)
      .attr('y', -radius*labelY)
      .style('opacity', 0)
    .merge(labelUpdate)
      .transition()
      .duration(750)
      .style('opacity', 1);

    
  labelUpdate.exit()
    .transition()
    .delay(500)
    .duration(750)
    .style('opacity', 0)
    .remove();
}