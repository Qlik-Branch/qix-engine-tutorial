import RxQ from 'RxQ';

export default function(config, appId){
  return RxQ.connectEngine(config, 'warm')
    .qOpenDoc(appId);
}