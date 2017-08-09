import RxQ from 'RxQ';

export default function(config){
  return RxQ.connectEngine(config, 'warm')
    .qOpenDoc(config.appname);
}