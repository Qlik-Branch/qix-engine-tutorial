import dimensionHyperCubeDef from './object-defs/dimension-hyper-cube-def.json';
import factHyperCubeDef from './object-defs/fact-hyper-cube-def.json';
import itemListObjectDef from './object-defs/item-list-object-def.json';
import departmentListObjectDef from './object-defs/department-list-object-def.json';
import dayListObjectDef from './object-defs/day-list-object-def.json';
import salesListObjectDef from './object-defs/sales-list-object-def.json';

export default function(app$){
  // Get app object observables
  const dimensionHyperCube$ = app$.qCreateSessionObject(dimensionHyperCubeDef);
  const factHyperCube$ = app$.qCreateSessionObject(factHyperCubeDef);
  const itemListObject$ = app$.qCreateSessionObject(itemListObjectDef);
  const departmentListObject$ = app$.qCreateSessionObject(departmentListObjectDef);
  const dayListObject$ = app$.qCreateSessionObject(dayListObjectDef);
  const salesListObject$ = app$.qCreateSessionObject(salesListObjectDef);

  const dimensionHyperCubeLayout$ = dimensionHyperCube$
    .qLayouts()
    .map(layout =>{
      return {
        headerData: layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}}),
        bodyData: layout.qHyperCube.qDataPages[0].qMatrix
      }
    });

  const factHyperCubeLayout$ = factHyperCube$
    .qLayouts()
    .map(layout =>{
      return {
        headerData: layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}}),
        bodyData: layout.qHyperCube.qDataPages[0].qMatrix
      }
    });

  const itemListObjectLayout$ = itemListObject$
    .qLayouts()
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  const departmentListObjectLayout$ = departmentListObject$
    .qLayouts()
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  const dayListObjectLayout$ = dayListObject$
    .qLayouts()
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  const salesListObjectLayout$ = salesListObject$
    .qLayouts()
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  return {
    dimensionHyperCube: {
      object$: dimensionHyperCube$,
      layout$: dimensionHyperCubeLayout$
    },
    factHyperCube: {
      object$: factHyperCube$,
      layout$: factHyperCubeLayout$
    },
    itemListObject: {
      object$: itemListObject$,
      layout$: itemListObjectLayout$
    },
    departmentListObject: {
      object$: departmentListObject$,
      layout$: departmentListObjectLayout$
    },
    dayListObject: {
      object$: dayListObject$,
      layout$: dayListObjectLayout$
    },
    salesListObject: {
      object$: salesListObject$,
      layout$: salesListObjectLayout$
    }
  };
}