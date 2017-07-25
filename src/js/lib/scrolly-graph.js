import * as d3 from 'd3';
import {graphScroll} from 'graph-scroll';

// ============== Graph-Scroll ==============
function scrollPosition(sectionList){
  window.addEventListener('load', function(){
    sectionList.forEach((section) =>{
      graphScroll() 
        .container(d3.select(section))
        .graph(d3.select(section +' .body-right'))
        .sections(d3.selectAll(section +' .body-left > *'));
    });
  })
}


function scrollOpacity(sectionList){
  var scale = d3.scaleLinear()
    .domain([200, 0])
    .range([0, 1])
    .clamp(true);

  window.addEventListener('scroll', onscroll);
  function onscroll(){
    sectionList.forEach((section) =>{ // for each section..
      // Get its top position relative to window
      var sectionTop = document.querySelector(section).getBoundingClientRect().top;
      // Set opacity as a function of position
      document.querySelector(section +' .body-right').style.opacity = scale(sectionTop);
    })
  } onscroll();
}

export {scrollPosition, scrollOpacity};