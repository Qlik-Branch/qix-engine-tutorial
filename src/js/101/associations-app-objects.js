import hyperCubeDef from './object-defs/hyperCubeDef.json';
import itemListObjectDef from './object-defs/itemListObjectDef.json';
import departmentListObjectDef from './object-defs/departmentListObjectDef.json';

export default function(app$){
  const hyperCube$ = app$.qCreateSessionObject(hyperCubeDef);
  const itemListObject$ = app$.qCreateSessionObject(itemListObjectDef);
  const departmentListObject$ = app$.qCreateSessionObject(departmentListObjectDef);

  return [hyperCube$, itemListObject$, departmentListObject$];
}