import Rx from 'rxjs';
import * as d3 from 'd3';

export default function(sectionClass){
  var prevParagraph, prevStage;

  // Create Scroll Observable
  const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
    .map(() => document.querySelector(sectionClass).getBoundingClientRect().top);


  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const paragraphSubject = new Rx.Subject();

  const paragraphStream = Rx.Observable.fromEvent(window, 'scroll')
    .map(() =>{
      const elemGroup = d3.select(sectionClass +' .graph-scroll-active');

      if(elemGroup._groups[0][0]) return +elemGroup.attr('element-group');
      else return 0;
    })
    .filter(paragraph =>{
      if(paragraph === prevParagraph) return false;
      else{
        prevParagraph = paragraph;
        return true;
      }
    });


  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const stageSubject = new Rx.Subject();

  const stageStream = paragraphSubject
    .map(paragraph => {
      return paragraph;
      // if(paragraph < 1) return 0;
      // else if
    })
    .filter(stage =>{
      // Only emit if we see a new stage
      if(stage === prevStage) return false;
      else {
        prevStage = stage;
        return true;
      }
    })

  paragraphStream.subscribe(paragraphSubject);
  stageStream.subscribe(stageSubject);

  return stageSubject;
}