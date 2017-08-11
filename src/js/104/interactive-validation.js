import * as d3 from 'd3';

import '../../imgs/dark-checkmark.png';

import checkmarkSrc from '../../imgs/checkmark.svg';
import xmarkSrc from '../../imgs/x-mark.svg';

export default function(sectionClass){
  var stage = 0;

  const d3Graph = d3.select(sectionClass +' .graph');

  // ============= SVG =============
  const svg = d3Graph.append('svg')
    .attr('width', '100%')
    .attr('height', '100%');

  
  // ============= State Circle =============
  const fillScale = d3.scaleLinear()
    .domain([0, 4])
    .range([140, 20]);

  // Clip path
  const clipPath = svg
    .append('defs')
    .append('clipPath')
      .attr('id', 'rect-clip');

  // Circle fill
  const circleFill = svg.append('circle')
    .attr('class', 'state-circle')
    .attr('cx', 80)
    .attr('cy', 80)
    .attr('r', 60)
    .attr('clip-path', 'url(#rect-clip)');

  // Draw Rect
  var recordCount = [{count: 4, key: 1}];
  updateRectClip(recordCount);

  function updateRectClip(data){
    const update = clipPath.selectAll('.rect-clip')
      .data(data, d => d.key);

    const enter = update
        .enter()
        .append('rect')
        .attr('class', 'rect-clip')
        .attr('x', 20)
        .attr('y', d => fillScale(d.count))
        .attr('width', 120)
        .attr('height', d => fillScale(0) - fillScale(d.count))
      .merge(update)
        .transition()
        .duration(750)
        .attr('y', d => fillScale(d.count));
  }


  // Circle outline
  svg.append('circle')
    .attr('class', 'state-circle-outline')
    .attr('cx', 80)
    .attr('cy', 80)
    .attr('r', 60);

  // Circle Text Data
  var stateCircleText = [
    {
      text: 'Current State',
      y: 80
    },
    {
      text: '4 records',
      y: 100
    }
  ];

  // Update State Circle Text Empty
  updateStateCircleTextEmpty(stateCircleText);
  function updateStateCircleTextEmpty(data){
    const update = svg.selectAll('.state-circle-text.empty')
      .data(data, d => d.text);

    update.enter()
        .append('text')
        .text(d => d.text)
        .attr('class', 'state-circle-text empty')
        .attr('x', 80)
        .attr('y', d => d.y)
      .merge(update)
        .text(d => d.text);
  }

  // Update State Circle Text Full
  updateStateCircleTextFull(stateCircleText);
  function updateStateCircleTextFull(data){
    const update = svg.selectAll('.state-circle-text.full')
      .data(data, d => d.text);

    update.enter()
        .append('text')
        .text(d => d.text)
        .attr('class', 'state-circle-text full')
        .attr('x', 80)
        .attr('y', d => d.y)
        .attr('clip-path', 'url(#rect-clip)')
      .merge(update)
        .text(d => d.text);
  }


  // ============= Output Label =============
  svg.append('text')
    .attr('class', 'output output-label')
    .text('Sum of (Sales)')
    .attr('x', '70%')
    .attr('y', 80);


  // ============= Output Value =============
  var outputValueData = ['232'];
  updateOutputValue(outputValueData);

  function updateOutputValue(data){
    const update = svg.selectAll('.output-value')
      .data(data);

    update
      .enter()
        .append('text')
        .attr('class', 'output output-value')
        .attr('x', '70%')
        .attr('y', 100)
      .merge(update)
        .text(d => d)
  };


  // ============= Checkmark =============
  var checkmarkImageData = [checkmarkSrc];
  updateCheckmarkImage(checkmarkImageData);

  function updateCheckmarkImage(data){
    const update = svg.selectAll('.checkmark-image')
      .data(data, d => d);

    update
      .enter()
      .append('image')
      .attr('class', 'checkmark-image')
      .attr('xlink:href', d => d)
      .attr('x', '45.5%')
      .attr('y', 75);

    update.exit()
      .remove();
  }


  // ============= Checkmark Circle =============
  const checkmarkCircle = svg.append('circle')
    .attr('class', 'checkmark-circle')
    .attr('cx', '46.5%')
    .attr('cy', 80)
    .attr('r', 15);


  // ============= Checkmark Validation Text =============
  var checkmarkValidationStatus = [{text: 'Validated', color: '#4D4D4D'}];
  updateCheckmarkValidationStatus(checkmarkValidationStatus);

  function updateCheckmarkValidationStatus(data){
    const update = svg.selectAll('.checkmark-validation-status')
      .data(data);

    update.enter()
        .append('text')
        .attr('class', 'checkmark-validation-status')
        .attr('x', '46.5%')
        .attr('y', 130)
      .merge(update)
        .text(d => d.text)
        .style('fill', d => d.color);
  }


  // ============= State Line =============
  svg.append('defs')
    .append('marker')
      .attr('id', 'arrow-head')
      .attr('refX', 6)
      .attr('refY', 6)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
    .append('path')
      .classed('arrow-head', true)
      .attr('d', 'M 0 0 20 6 0 12');

  const stateLine1 = svg.append('line')
    .attr('class', 'state-line')
    .attr('x1', 160)
    .attr('y1', 80)
    .attr('y2', 80);

  const stateLine2 = svg.append('line')
    .attr('class', 'state-line')
    .attr('y1', 80)
    .attr('x2', '65%')
    .attr('y2', 80)
    .attr('marker-end', 'url(#arrow-head)');


  // ============= Action Button =============
  var actionButtonData = [{text: 'Filter', key: 1}];
  const actionRect = svg
    .append('rect')
    .attr('class', 'action-rect')
    .attr('x', 28.5)
    .attr('y', 160)
    .attr('width', 103)
    .attr('height', 29)
    .on('click', function(){
      if(stage === 0){
        recordCount = [{count: 1, key: 1}];
        stateCircleText[1].text = '1 of 4 records';
        actionButtonData = [{text: 'Get Layout', key: 1}];
        checkmarkValidationStatus = [{text: 'Invalidated', color: '#D0021B'}];
        checkmarkImageData = [xmarkSrc];
        stage = 1;
      } else if(stage === 1){
        actionButtonData = [{text: 'Reset', key: 1}];
        checkmarkValidationStatus = [{text: 'Validated', color: '#4D4D4D'}];
        outputValueData = ['50'];
        checkmarkImageData = [checkmarkSrc];
        stage = 2;
      } else if(stage === 2){
        recordCount = [{count: 4, key: 1}];
        stateCircleText[1].text = '4 records';
        actionButtonData = [{text: 'Filter', key: 1}];
        checkmarkValidationStatus = [{text: 'Validated', color: '#4D4D4D'}];
        outputValueData = ['232'];
        checkmarkImageData = [checkmarkSrc];
        stage = 0;
      }

      updateRectClip(recordCount);
      updateStateCircleTextEmpty(stateCircleText);
      updateStateCircleTextFull(stateCircleText);
      updateActionButton(actionButtonData);
      updateCheckmarkValidationStatus(checkmarkValidationStatus);
      updateOutputValue(outputValueData);
      updateCheckmarkImage(checkmarkImageData);
    })

  updateActionButton(actionButtonData);
  function updateActionButton(data){
    const update = svg.selectAll('.action-text')
      .data(data, d => d.key);

    update.enter()
        .append('text')
        .attr('class', 'action-text')
        .text(d => d.text)
        .attr('x', 80)
        .attr('y', 180)
        .on('click', function(){
          if(stage === 0){
            recordCount = [{count: 1, key: 1}];
            stateCircleText[1].text = '1 of 4 records';
            actionButtonData = [{text: 'Get Layout', key: 1}];
            checkmarkValidationStatus = [{text: 'Invalidated', color: '#D0021B'}];
            checkmarkImageData = [xmarkSrc];
            stage = 1;
          } else if(stage === 1){
            actionButtonData = [{text: 'Reset', key: 1}];
            checkmarkValidationStatus = [{text: 'Validated', color: '#4D4D4D'}];
            outputValueData = ['50'];
            checkmarkImageData = [checkmarkSrc];
            stage = 2;
          } else if(stage === 2){
            recordCount = [{count: 4, key: 1}];
            stateCircleText[1].text = '4 records';
            actionButtonData = [{text: 'Filter', key: 1}];
            checkmarkValidationStatus = [{text: 'Validated', color: '#4D4D4D'}];
            outputValueData = ['232'];
            checkmarkImageData = [checkmarkSrc];
            stage = 0;
          }

          updateRectClip(recordCount);
          updateStateCircleTextEmpty(stateCircleText);
          updateStateCircleTextFull(stateCircleText);
          updateActionButton(actionButtonData);
          updateCheckmarkValidationStatus(checkmarkValidationStatus);
          updateOutputValue(outputValueData);
          updateCheckmarkImage(checkmarkImageData);
        })
      .merge(update)
        .text(d => d.text);

    update.exit()
        .remove();

  }


  // ============= Resize =============
  window.addEventListener('resize', resize);
  function resize(){
    // BBox Dimensions
    const checkmarkCircleBBox = checkmarkCircle._groups[0][0].getBBox();
    
    // Set Line1
    stateLine1.attr('x2', checkmarkCircleBBox.x - 5);
    stateLine2.attr('x1', checkmarkCircleBBox.x + checkmarkCircleBBox.width + 5);
  } resize();
}