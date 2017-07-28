import * as d3 from 'd3';

export default function(list, data, offset){
  const circleContainerRadius = 48.6;
  const theta = 2*Math.PI/data.length;
  // Attach data
  const update = list
    .selectAll('.list-object-value')
    .data(data, d => d[0].index);

  console.log(update);

  const enter = update
    .enter()
    .append('circle')
    .attr('data-qelemno', d=> d[0].qElemNumber)
    .attr('class', 'list-object-value')
    .attr('cx', (d, i) => (circleContainerRadius/2)*Math.cos(i*theta + offset))
    .attr('cy', (d, i) => (circleContainerRadius/2)*Math.sin(i*theta + offset))
    .attr('r', 0);

  enter
    .transition()
    .delay(500)
    .duration(750)
    .attr('r', circleContainerRadius/4)

  enter
    .merge(update)
    .style('fill', d =>{
      if(d[0].qState === 'O') return '#fff';
      else if(d[0].qState === 'A') return altColor;
      else if(d[0].qState === 'X') return '#686868';
      else if(d[0].qState === 'XS') return '#686868';
      else if(d[0].qState === 'S') return '#45EE59';
    });


  update.exit()
    .transition()
    .duration(750)
    .attr('r', 0)
    .remove();
}