import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

export default function(sectionClass){
  /* Add an invisible line width 0 width to use as the scrolling section
      in graph-scroll */
  const d3Section = d3.select(sectionClass)
    .classed('fixed-transition', true);

  d3Section
    .append('div')
      .attr('class', 'scroll-line')
    .append('div');

  
  // Add graph-scroll
  window.addEventListener('load', function(){
    graphScroll()
      .container(d3.select(sectionClass))
      .graph(d3.select(sectionClass +' .row'))
      .sections(d3.selectAll(sectionClass +' .scroll-line'));
  });

  const d3Graph = d3Section.select('.graph');


  // ============== SVG ==============
  const svg = d3Graph
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');


  // ============== Labels ==============
  svg.append('text')
    .text('Static Property')
    .attr('class', 'property-label static-property-label')
    .attr('x', 20)
    .attr('y', 20);

  svg.append('text')
    .text('Dynamic Property')
    .attr('class', 'property-label dynamic-property-label')
    .attr('x', 20)
    .attr('y', '50%');

  var numberLabels = [
    {
      text: '42',
      class: 'property-label static-number-label number-label-left number-label',
      x: '30%',
      y: '25%'
    },
    {
      text: '42',
      class: 'property-label static-number-label number-label',
      x: '90%',
      y: '25%'
    },
    {
      text: 'Sum(Sales)',
      class: 'property-label dynamic-number-label-1 number-label-left number-label',
      x: '30%',
      y: '75%'
    },
    {
      text: '?',
      class: 'property-label dynamic-number-label-1 number-label',
      x: '90%',
      y: '75%'
    }
  ];

  svg.selectAll('.number-label')
    .data(numberLabels, d => d.text)
    .enter()
    .append('text')
    .text(d => d.text)
    .attr('class', d => d.class)
    .attr('x', d => d.x)
    .attr('y', d => d.y);


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
    .attr('x1', '31%')
    .attr('y1', '24%')
    .attr('x2', '88%')
    .attr('y2', '24%')
    .attr('marker-end', 'url(#triangle)');


  // ============== Dynamic Line ==============
  const dynamicCircle = svg.append('circle')
    .attr('class', 'dynamic-circle')
    .attr('cx', '61%')
    .attr('cy', '74%')
    .attr('r', '10%');

  const dynamicLine1 = svg.append('line')
    .attr('class', 'dynamic-line-1')
    .attr('x1', '31%')
    .attr('y1', '74%')
    .attr('y2', '74%');

  const dynamicLine2 = svg.append('line')
    .attr('class', 'dynamic-line-2')
    .attr('y1', '74%')
    .attr('x2', '88%')
    .attr('y2', '74%');


  const arc = d3.arc()
    .startAngle((3/2)*Math.PI)
    .endAngle((3/2)*Math.PI);

  const dynamicCircleFill = svg.append('path')
    .attr('class', 'dynamic-circle-fill');

  const dynamicLine1Fill = svg.append('line')
    .attr('class', 'dynamic-line-1-fill')
    .attr('x1', '31%')
    .attr('y1', '74%')
    .attr('x2', '31%')
    .attr('y2', '74%');

  const dynamicLine2Fill = svg.append('line')
    .attr('class', 'dynamic-line-2-fill')
    .attr('y1', '74%')
    .attr('y2', '74%');


  // ============== D3 Scales ==============
  const dynamicLine1Scale = d3.scaleLinear()
    .domain([-100, -400])
    .clamp(true);

  const dynamicCircleStartAngle = d3.scaleLinear()
    .domain([-400, -700])
    .range([(3/2)*Math.PI, (1/2)*Math.PI])
    .clamp(true);

  const dynamicCircleEndAngle = d3.scaleLinear()
    .domain([-400, -700])
    .range([(3/2)*Math.PI, (5/2)*Math.PI])
    .clamp(true);

  const dynamicLine2Scale = d3.scaleLinear()
    .domain([-700, -1000])
    .clamp(true);


  // ============== Resize ==============
  window.addEventListener('resize', resize);
  function resize(){
    // Circle Properties
    const dynamicCircleBBox = dynamicCircle._groups[0][0].getBBox()

    const dynamicCircleLeftEdge = dynamicCircleBBox.x,
      dynamicCircleRightEdge = dynamicCircleBBox.x + dynamicCircleBBox.width,
      dynamicCircleTopEdge = dynamicCircleBBox.y,
      dynamicCircleRadius = dynamicCircleBBox.width/2;

    // Set dynamic lines
    dynamicLine1.attr('x2', dynamicCircleLeftEdge);
    dynamicLine2.attr('x1', dynamicCircleRightEdge);

    // Set arc radii
    arc
      .innerRadius(dynamicCircleRadius - 0.5)
      .outerRadius(dynamicCircleRadius + 0.5);

    // Set dynamicCircle
    dynamicCircleFill
      .attr('d', arc)
      .attr('transform', `translate(
        ${dynamicCircleLeftEdge + dynamicCircleRadius}, 
        ${dynamicCircleTopEdge + dynamicCircleRadius})`
      );

    // Set dynamicLine2Fill
    dynamicLine2Fill
      .attr('x1', dynamicCircleRightEdge)
      .attr('x2', dynamicCircleRightEdge);

    // Set DynamicLineScale
    const dynamicLine1BBox = dynamicLine1._groups[0][0].getBBox();
    dynamicLine1Scale.range([dynamicLine1BBox.x, dynamicCircleLeftEdge]);
    
    const dynamicLine2BBox = dynamicLine2._groups[0][0].getBBox(),
      dynamicLine2X2 = dynamicLine2BBox.x + dynamicLine2BBox.width;
    dynamicLine2Scale.range([dynamicCircleRightEdge, dynamicLine2X2]);

  } resize();


  // ============== Scroll ==============
  window.addEventListener('scroll', scroll);
  function scroll(){
    // Get section top position
    const sectionTop = document.querySelector(sectionClass).getBoundingClientRect().top;

    // Dynamic Line 1
    dynamicLine1Fill.attr('x2', dynamicLine1Scale(sectionTop));
    
    // Dynamic Circle
    arc
      .startAngle(dynamicCircleStartAngle(sectionTop))
      .endAngle(dynamicCircleEndAngle(sectionTop));
    dynamicCircleFill.attr('d', arc);

    // Dynamic Line 2
    dynamicLine2Fill.attr('x2', dynamicLine2Scale(sectionTop));

    // Output Value
    if(sectionTop <= -1000) {
      numberLabels[3].text = '532';
      updateNumberLabel(numberLabels);
    } else{
      numberLabels[3].text = '?';
      updateNumberLabel(numberLabels);
    }
  }

  function updateNumberLabel(data){
    svg.selectAll('.number-label')
      .data(data, d => d.text)
      .text(d => d.text);
  }

}