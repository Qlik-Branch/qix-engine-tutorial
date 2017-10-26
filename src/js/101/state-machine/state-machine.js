import Rx from 'rxjs';
import * as d3 from 'd3';

import stateHtml from './state-html.js';
import paintTable from '../paint-table.js';
import stateStageObservable from './state-stage-observable.js';

export default function(sectionClass){
  // ========== HTML ==========
  const html = stateHtml(sectionClass);

  const tableData = {
    headerData: [{qText: 'Item'}, {qText: 'Department'}],
    bodyData: [
      [{qText: 'Chair'},{qText: 'Furniture'}],
      [{qText: 'T-Shirt'}, {qText: 'Clothing'}],
      [{qText: 'Pants'}, {qText: 'Clothing'}],
      [{qText: 'Camera'}, {qText: 'Electronics'}]
    ]
  };

  const filteredTableData = {
    headerData: [{qText: 'Item'}, {qText: 'Department'}],
    bodyData: [[{qText: 'Camera'}, {qText: 'Electronics'}]]
  };

  paintTable(html.table, tableData, 0);
  paintTable(html.filteredTable, filteredTableData, 0);


  // ========== Observables ==========
  const stage$ = stateStageObservable(sectionClass);
  // stage$.subscribe(s => console.log(s));


  // ========== Subscribe ==========
  const stage1$ = stage$
    .map(m => m >= 1)
    .distinctUntilChanged();

  // ========== Stage 1 ==========
  stage1$
    .filter(f => f)
    .subscribe(() =>{
      html.d3Graph.selectAll('.stage-1')
        .transition()
        .duration(750)
        .style('opacity', 1);
    });

  stage1$
    .filter(f => !f)
    .subscribe(() =>{
      html.d3Graph.selectAll('.stage-1')
        .transition()
        .duration(750)
        .style('opacity', 0);
    });

  // ========== Stage 2 ==========
  const stage2$ = stage$
    .map(m => m>=2)
    .distinctUntilChanged();

  stage2$
    .filter(f => f)
    .subscribe(() =>{
      html.d3Graph.selectAll('.stage-2')
        .transition()
        .duration(750)
        .style('opacity', 1);

      html.d3Graph.selectAll('.stage-3')
        .transition()
        .delay(1000)
        .duration(750)
        .style('opacity', 1);
    })

  stage2$
    .filter(f => !f)
    .subscribe(() =>{
      html.d3Graph.selectAll('.stage-2, .stage-3')
        .transition()
        .duration(750)
        .style('opacity', 0);
    })
}
