import Rx from 'rxjs';
import * as d3 from 'd3';

export default function(sectionClass){
  /* Observable to emit the current paragraph section we scroll to. Only emits
      when a new paragraph is reached (paragraph != prevParagraph) */
  const paragraphStream = 
  Rx.Observable.fromEvent(window, 'load')
    .switchMap(() =>{
      return Rx.Observable.fromEvent(window, 'scroll')
        .startWith(window, 'scroll')
        // .delay(1000)
        .map(() =>{
          const elemGroup = d3.select(sectionClass +' .graph-scroll-active');
          
          if(elemGroup._groups[0][0]) return +elemGroup.attr('element-group');
          else return 0;
        })
        .distinctUntilChanged();
    })


  /* Observable to emit the current selection stage */
  const stageStream = paragraphStream
    .map(paragraph => {
      if(paragraph >= 2) return 2;
      else if(paragraph >= 1) return 1;
      else                    return 0;
    })
    .distinctUntilChanged()
    .publish()
    // .refCount();

  stageStream.connect();

  return stageStream;
}