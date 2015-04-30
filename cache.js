// magic always fresh cache

import csp, {go, timeout} from 'js-csp';
import {connect, docs, run, toArray} from './index.js';

import {sto} from 'disto';


export function consume(arr, diff){
  return diff.old_val ?   
    (diff.new_val ? 
      arr.map(el => (el.id === diff.old_val.id) ? diff.new_val : el) :     
      arr.filter(el => el.id !== diff.old_val.id)) : 
    arr.concat([diff.new_val]); 
}

export function live(query, connection){ 
  var stream;
  var store = sto([], (state, action, ...args) => {
    switch(action){
      case 'diff':
        return consume(state, args[0]);
      case 'set':
        return args[0];
      default: 
        return state;
    }
  });

  go(function*(){
    // first prefill the cache
    store('set', yield toArray(yield run(query, connection)));
    // then remake on every change
    stream = docs(yield run(query.changes(), connection));
    var diff;
    while((diff = yield stream) !== csp.CLOSED){
      store('diff', diff)
    }     
  });  
  store.stop = () => stream.stop();
  
  return store;  
}


// import r from 'rethinkdb';

// go(function*(){
//   var store = live(r.db('test').table('sample'), yield connect(r));
//   store.on('change', state => console.log(state));
//   while(true){
//     yield timeout(1000);
//     console.log('5s:', store());
//   }
// })

// // require('babel/polyfill');
// var r = require('rethinkdb');

// var cache = require('./cache.js'),
//   live = cache.live;



// r.connect(function(err, conn){
//   var store = live(r.db('test').table('sample'), conn); 
//   store.on('change', function(state) {console.log('changed:', state)});
//   setInterval(function(){
//     console.log('timed:', store())
//   }, 1000)  
// })
