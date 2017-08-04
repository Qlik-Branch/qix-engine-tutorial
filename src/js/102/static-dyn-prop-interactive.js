import * as d3 from 'd3';

export default function(sectionClass){
  const d3Section = d3.select(sectionClass),
    d3Graph = d3Section.select('.graph');

  var circleBBox, line2BBox;

  // ============== SVG ==============
  const svg = d3Graph.append('svg')
    .attr('width', '100%')
    .attr('height', '100%');


  // ============== Labels ==============
  const labels = [
    {
      text: 'Properties',
      class: 'interactive-label left-label',
      x: 20,
      y: 20
    },
    {
      text: 'Static Property:',
      class: 'interactive-label left-label',
      x: 20,
      y: '35%'
    },
    {
      text: 'Dynamic Property',
      class: 'interactive-label left-label',
      x: 20,
      y: '65%'
    },
    {
      text: 'Sum',
      class: 'interactive-label left-label',
      x: 20,
      y: '73%'
    },
    {
      text: 'Layout',
      class: 'interactive-label right-label',
      x: '85%',
      y: 20
    }
  ]

  svg.selectAll('.interactive-label')
    .data(labels)
    .enter()
    .append('text')
    .text(d => d.text)
    .attr('class', d => d.class)
    .attr('x', d => d.x)
    .attr('y', d => d.y);


  // ============== Input Box ==============
  d3Graph.append('input')
    .attr('class', 'input-box')
    .attr('value', '42')
    .on('input', function(){
      numberData[0].text = this.value;
      updateInteractiveNumber(numberData);
    });


  // ============== Dropdown Box ==============
  const dropdownBox = d3Graph.append('select')
    .attr('class', 'dropdown-box')
    .on('change', function(){
      const transitionDuration = 300;

      numberData[1].text = '?';
      updateInteractiveNumber(numberData);

      // Line 1
      line1Fill
        .attr('x2', 145)
        .transition()
        .duration(transitionDuration)
        .attr('x2', circleBBox.x);

      // Circle
      circleFill
        .datum({startAngle: (3/2)*Math.PI, endAngle: (3/2)*Math.PI})
        .attr('d', arc)
        .transition()
        .duration(transitionDuration)
        .delay(transitionDuration)
        .attrTween('d', arcTween((1/2)*Math.PI, (5/2)*Math.PI));

      // Line 2
      line2Fill
        .attr('x2', circleBBox.x + circleBBox.width)
        .transition()
        .duration(transitionDuration)
        .delay(transitionDuration*2)
        .attr('x2', line2BBox.x + line2BBox.width);

      // Update Output Value
      setTimeout(() =>{
        if(this.value === 'sales') numberData[1].text = '232';
        else if(this.value === 'cost') numberData[1].text = '200';

        updateInteractiveNumber(numberData);
      }, 3*transitionDuration)
    })
  
  dropdownBox.append('option')
    .attr('disable', true)
    .attr('selected', true)
    .attr('value', true)
    .style('display', 'none');

  dropdownBox.append('option')
    .attr('value', 'sales')
    .html('(Sales)');

  dropdownBox.append('option')
    .attr('value', 'cost')
    .html('(Cost)');


  // ============== Output Numbers ==============
  var numberData = [
    {
      text: '42',
      y: '35%'
    },
    {
      text: '?',
      y: '73%'
    }
  ];

  const interactiveNumber = svg.selectAll('.interactive-number')
    .data(numberData, d => d.text)
    .enter()
    .append('text')
    .attr('class', 'interactive-number')
    .attr('x', '85%')
    .attr('y', d => d.y);
  updateInteractiveNumber(numberData);

  function updateInteractiveNumber(data){
    interactiveNumber
      .data(data, d => d.text)
      .text(d => d.text);
  };


  // ============== Arrow Head ==============
  svg.append("svg:defs")
    .append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("orient", "auto")
    .append("path")
      .classed('arrow-head', true)
      .attr('d', 'M 0 0 12 6 0 12');

    
  // ============== Line ==============
  svg.append('line')
    .attr('class', 'static-line')
    .attr('x1', 185)
    .attr('y1', '33%')
    .attr('x2', '83%')
    .attr('y2', '33%')
    .attr('marker-end', 'url(#triangle)');


  const dottedCircle = svg.append('circle')
    .attr('class', 'dotted-circle')
    .attr('cx', '56%')
    .attr('cy', '71%')
    .attr('r', '10%');

  const dottedLine1 = svg.append('line')
    .attr('class', 'dotted-line-1')
    .attr('x1', 145)
    .attr('y1', '71%')
    .attr('y2', '71%');

  const dottedLine2 = svg.append('line')
    .attr('class', 'dotted-line-2')
    .attr('y1', '71%')
    .attr('x2', '83%')
    .attr('y2', '71%');


  // ============== Line Fill ==============
  const line1Fill = svg.append('line')
    .attr('class', 'line-1-fill')
    .attr('x1', 145)
    .attr('y1', '71%')
    .attr('x2', 145)
    .attr('y2', '71%')

  const arc = d3.arc()
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle);

  function arcTween(newStartAngle, newEndAngle){
    return function(d){
      const interpolateStart = d3.interpolate(d.startAngle, newStartAngle);
      const interpolateEnd = d3.interpolate(d.endAngle, newEndAngle);
      return function(t){
        d.startAngle = interpolateStart(t);
        d.endAngle = interpolateEnd(t);
        return arc(d);
      }
    }
  }

  const circleFill = svg.append('path')
    .datum({startAngle: (3/2)*Math.PI, endAngle: (3/2)*Math.PI})
    .attr('class', 'circle-fill');

  const line2Fill = svg.append('line')
    .attr('class', 'line-2-fill')
    .attr('y1', '71%')
    .attr('y2', '71%');


  // ============== Resize ==============
  window.addEventListener('resize', resize);
  function resize(){
    // BBox Dimensions
    circleBBox = dottedCircle._groups[0][0].getBBox();
    line2BBox = dottedLine2._groups[0][0].getBBox();

    // Set Circle
    arc
      .innerRadius(circleBBox.width/2 - 0.5)
      .outerRadius(circleBBox.width/2 + 0.5);
    
    circleFill.attr('transform', `translate(
      ${circleBBox.x + circleBBox.width/2},
      ${circleBBox.y + circleBBox.height/2})`
    );

    // Set Line 1
    dottedLine1.attr('x2', circleBBox.x);

    // Set Line 2
    dottedLine2.attr('x1', circleBBox.x + circleBBox.width);
    line2Fill
      .attr('x1', circleBBox.x + circleBBox.width)
      .attr('x2', circleBBox.x + circleBBox.width);
  } resize();
}