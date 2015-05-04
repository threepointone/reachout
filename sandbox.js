import {run, docs, connect} from './index';
import r from 'rethinkdb';
import {go} from 'js-csp';

go(function*(){
  var records = yield docs(yield run(r.db('myx_layouts').table('RetailAndroid'), yield connect(r, {})));
  while(true){
    console.log(yield records);
  }
});
