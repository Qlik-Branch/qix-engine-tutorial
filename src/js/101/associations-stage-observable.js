import Rx from 'rxjs';

export default function(sectionClass, leftPaneGroups){
  const groups = leftPaneGroups.groups;
  var prevParagraph, prevStage; // Hold state of prevStage and prevParagraph

  // Create Scroll Observable
  const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
    .map(() => document.querySelector(sectionClass).getBoundingClientRect().top);


  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const paragraphSubject = new Rx.Subject();

  /* Observable to emit the current paragraph section we scroll to. Only emits
      when a new paragraph is reached (paragraph != prevParagraph) */
  const paragraphStream = scrollStream
    .map(sectionTop =>{
      // Return current paragraph section 
      if(sectionTop >= -500) return 0;
      else if(sectionTop < -500*groups) return groups;
      else return Math.floor(sectionTop/-500);
    })
    .filter(paragraph => {
      // Only emit if we see a new paragraph
      if(paragraph === prevParagraph) return false;
      else {
        prevParagraph = paragraph;
        return true;
      }
    });


  /* Create a reactive Subject to emit our stage stream to multiple observers */
  const stageSubject = new Rx.Subject();

  /* Observable to emit the current selection stage */
  const stageStream = paragraphSubject
    .map(paragraph => {
      // Return stage
      if(paragraph < 1)       return 0;   // Display Table
      else if(paragraph < 2)  return 1;   // Draw Item Listbox
      else if(paragraph < 3)  return 2;   // Draw Department Listbox
      else if(paragraph < 4)  return 3;   // Draw Listbox Connection
      else if(paragraph < 5)  return 4;   // Clear all
      else if(paragraph < 13) return 5;   // Select Clothing
      else if(paragraph < 15) return 6;   // Select T-Shirt
      else if(paragraph < 16) return 7;   // Clear all
      else if(paragraph < 17) return 8;   // Select T-Shirt and Camera
      else if(paragraph < 18) return 9;   // Select Clothing
      else if(paragraph < 21) return 10;   // Select ONLY T-Shirt and Camera
      else if(paragraph < 22) return 11;   // Select Furniture
      else if(paragraph < 23) return 12;   // Select T-Shirt and Camera
      else if(paragraph < 26) return 13;   // Alternative Grey
      else                    return 14;  // Interactive
    })
    .filter(stage =>{
      // Only emit if we see a new stage
      if(stage === prevStage) return false;
      else {
        prevStage = stage;
        return true;
      }
    });

  paragraphStream.subscribe(paragraphSubject);
  stageStream.subscribe(stageSubject);

  return [paragraphSubject, stageSubject];
}