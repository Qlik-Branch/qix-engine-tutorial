import * as d3 from 'd3';

import '../../imgs/light-checkmark.png';
import '../../imgs/dark-checkmark.png';

import checkmarkSVG from '../../imgs/checkmark.svg';


export default function(list, data, offset, altColor, selectionTransition){
  // const selectionTransition = 500;
  const circleContainerRadius = 48.6;
  const theta = 2*Math.PI/data.length;

  // =========== Circle ===========
  // Attach data
  const updateCircle = list
    .selectAll('.list-object-circle')
    .interrupt()
    .data(data)
    
  // Enter new circle
  const enterCircle = updateCircle
    .enter()
    .append('circle')
    .attr('data-qelemno', d=> d[0].qElemNumber)
    .attr('class', 'list-object-circle')
    .attr('cx', (d, i) => (circleContainerRadius*.6)*Math.cos(i*theta + offset))
    .attr('cy', (d, i) => (circleContainerRadius*.6)*Math.sin(i*theta + offset))
    .attr('r', 0);


  // Enter/Update circle color
  enterCircle
    .transition()
    .delay(500)
    .duration(750)
    .attr('r', 10)
    .style('fill', d =>{
      if(d[0].qState === 'O') return '#fff';
      else if(d[0].qState === 'A') return altColor;
      else if(d[0].qState === 'X') return '#686868';
      else if(d[0].qState === 'XS') return '#686868';
      else if(d[0].qState === 'S') return '#45EE59';
    });

  updateCircle
    .transition()
    .duration(selectionTransition)
    .attr('r', 10)
    .style('fill', d =>{
      if(d[0].qState === 'O') return '#fff';
      else if(d[0].qState === 'A') return altColor;
      else if(d[0].qState === 'X') return '#686868';
      else if(d[0].qState === 'XS') return '#686868';
      else if(d[0].qState === 'S') return '#45EE59';
    });


  // Exit circle
  updateCircle.exit()
    .transition()
    .duration(750)
    .attr('r', 0)
    .remove();


  // =========== Checkmark ===========
  const check = d3.xml(checkmarkSVG)
    .get((error, xml) =>{
      // console.log(xml.documentElement);
    })

  // Attach data
  const updateCheckmark = list
    .selectAll('.list-object-checkmark')
    .interrupt()
    .data(data);

  // Enter new checkmark
  const enterCheckmark = updateCheckmark
    .enter()
    .append('image')
    .attr('class', 'list-object-checkmark')
    .attr('xlink:href', 'images/dark-checkmark.png')
    .attr('data-qelemno', d => d[0].qElemNumber)
    .attr('x', (d, i) => (circleContainerRadius*.6)*Math.cos(i*theta + offset) - 7)
    .attr('y', (d, i) => (circleContainerRadius*.6)*Math.sin(i*theta + offset) - 5)
    .style('opacity', 0)
    .transition()
    .delay(500)
    .duration(750)
    .style('opacity', d =>{
      if(d[0].qState === 'S' || d[0].qState === 'XS') return 1;
      else return 0;
    })

  updateCheckmark
    .transition()
    .duration(selectionTransition)
    .style('opacity', d =>{
      if(d[0].qState === 'S' || d[0].qState === 'XS') return 1;
      else return 0;
    });

  // Exit Checkmark
  updateCheckmark.exit()
    .remove();


  // =========== Label ===========
  // Attach data
  const updateLabel = list
    .selectAll('.list-object-label')
    .interrupt()
    .data(data);

  // Enter new label
  const enterLabel = updateLabel
    .enter()
    .append('text')
    .text(d => d[0].qText)
    .attr('data-qelemno', d => d[0].qElemNumber)
    .attr('class', 'list-object-label')
    .attr('x', (d, i) => (circleContainerRadius + 5)*Math.cos(i*theta + offset))
    .attr('y', (d, i) => (circleContainerRadius + 5)*Math.sin(i*theta + offset) + 1)
    .style('opacity', 0);

  // Enter update label positioning
  enterLabel
    .style('text-anchor', (d, i) =>{
      if(Math.abs(Math.cos(i*theta + offset)) < 0.0000001) return 'middle';
      else if(Math.cos(i*theta + offset) > 0) return 'start';
      else return 'end';
    })
    .style('alignment-baseline', 'middle')
    .transition()
    .delay(500)
    .duration(750)
    .style('opacity', 1);

  updateLabel
    .transition()
    .duration(750)
    .style('opacity', 1);

  // Exit Label
  updateLabel.exit()
    .transition()
    .duration(750)
    .style('opacity', 0)
    .remove();
}