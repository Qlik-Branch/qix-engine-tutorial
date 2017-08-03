import Rx from 'rxjs';
import * as d3 from 'd3';

export default function(sectionClass, app$){
  // Create Scroll Observable
  const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
    .map(() => document.querySelector(sectionClass).getBoundingClientRect().top);


  /* Observable to emit the current paragraph section we scroll to. Only emits
      when a new paragraph is reached (paragraph != prevParagraph) */
  const paragraph$ = Rx.Observable.fromEvent(window, 'load')
    .switchMap(() =>{
      return app$.switchMap(() =>{
        return Rx.Observable.fromEvent(window, 'scroll')
          .map(() =>{
            const elemGroup = d3.select(sectionClass +' .graph-scroll-active');
            
            if(elemGroup._groups[0][0]) return +elemGroup.attr('element-group');
            else return 0;
          })
          .distinctUntilChanged();
      })
    })


  const stage$ = paragraph$
    .map(paragraph => {
      // Return stage
      if(paragraph >= 15) return 12;
      else if(paragraph >= 14) return 11;
      else if(paragraph >= 13) return 10;
      else if(paragraph >= 12) return 9;
      else if(paragraph >= 11) return 8;
      else if(paragraph >= 10) return 7;
      else if(paragraph >= 9) return 6;
      else if(paragraph >= 7) return 5;
      else if(paragraph >= 4) return 4;
      else if(paragraph >= 3) return 3;
      else if(paragraph >= 2) return 2;
      else if(paragraph >= 1) return 1;
      else                    return 0;
    })
    .distinctUntilChanged()
    .publish();

  stage$.connect()

  return stage$;
}