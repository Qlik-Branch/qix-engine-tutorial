import dimensionHyperCubeDef from './object-defs/dimension-hyper-cube-def.json';
import factHyperCubeDef from './object-defs/fact-hyper-cube-def.json';
import itemListObjectDef from './object-defs/item-list-object-def.json';
import departmentListObjectDef from './object-defs/department-list-object-def.json';
import dayListObjectDef from './object-defs/day-list-object-def.json';
import salesListObjectDef from './object-defs/sales-list-object-def.json';
import salesSumObjectDef from './object-defs/sales-sum-object-def.json';
import departmentSalesHyperCubeDef from './object-defs/department-sales-hyper-cube-def.json';

export default function(app$){
  // Get app object observables
  const dimensionHyperCube$ = app$.qCreateSessionObject(dimensionHyperCubeDef);
  const factHyperCube$ = app$.qCreateSessionObject(factHyperCubeDef);
  const itemListObject$ = app$.qCreateSessionObject(itemListObjectDef);
  const departmentListObject$ = app$.qCreateSessionObject(departmentListObjectDef);
  const dayListObject$ = app$.qCreateSessionObject(dayListObjectDef);
  const salesListObject$ = app$.qCreateSessionObject(salesListObjectDef);
  const salesSumObject$ = app$.qCreateSessionObject(salesSumObjectDef);
  const departmentSalesHyperCube$ = app$.qCreateSessionObject(departmentSalesHyperCubeDef);

  // Dimension HyperCube Layout
  const dimensionHyperCubeLayout$ = dimensionHyperCube$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout =>{
      return {
        headerData: layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}}),
        bodyData: layout.qHyperCube.qDataPages[0].qMatrix
      }
    });

  // Fact HyperCube Layout
  const factHyperCubeLayout$ = factHyperCube$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout =>{
      return {
        headerData: layout.qHyperCube.qDimensionInfo.map(d =>{return {qText: d.qFallbackTitle}}),
        bodyData: layout.qHyperCube.qDataPages[0].qMatrix
      }
    });

  // Department Sales HyperCube Layout
  const departmentSalesHyperCubeLayout$ = departmentSalesHyperCube$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout =>{
      const headerData = [];
      layout.qHyperCube.qDimensionInfo.map(d => {headerData.push({qText: d.qFallbackTitle})});
      layout.qHyperCube.qMeasureInfo.map(d => {headerData.push({qText: d.qFallbackTitle})});
      return {
        headerData: headerData,
        bodyData: layout.qHyperCube.qDataPages[0].qMatrix
      }
    })

  // Item ListObject Layout
  const itemListObjectLayout$ = itemListObject$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj=>
      obj.getLayout()
        .retryWhen(errors => errors.delay(1000))
        .catch(err=> Rx.Observable.empty()))
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  // Department ListObject Layout
  const departmentListObjectLayout$ = departmentListObject$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj=>
      obj.getLayout()
        .retryWhen(errors => errors.delay(1000))
        .catch(err=> Rx.Observable.empty()))
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  // Day ListObject Layout
  const dayListObjectLayout$ = dayListObject$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  // Sales ListObject Layout
  const salesListObjectLayout$ = salesListObject$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout => layout.qListObject.qDataPages[0].qMatrix);

  // Sales Sum Layout
  const salesSumLayout$ = salesSumObject$
    // .qLayouts()
    .qInvalidated()
    .switchMap(obj => obj
      .getLayout()
      .retryWhen(errors => errors.delay(1000))
      .catch(err=> Rx.Observable.empty()))
    .map(layout => +layout.sales);
    

  return {
    dimensionHyperCube: {
      object$: dimensionHyperCube$,
      layout$: dimensionHyperCubeLayout$
    },
    factHyperCube: {
      object$: factHyperCube$,
      layout$: factHyperCubeLayout$
    },
    departmentSalesHyperCube: {
      object$: departmentSalesHyperCube$,
      layout$: departmentSalesHyperCubeLayout$
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
    },
    salesSumObject: {
      object$: salesSumObject$,
      layout$: salesSumLayout$
    }
  };
}