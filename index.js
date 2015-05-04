import csp, {go, chan, put} from 'js-csp';

export function fromNodeCallback(fn){
  var c = chan();
  fn(function(err, res){
    go(function*(){
      yield put(c, err || res);
      c.close();
    });
  });
  return c;
}


export function connect(r, ...args){
  return fromNodeCallback(done => r.connect(...args, done));
}

export function run(query, connection){
  return fromNodeCallback(done => query.run(connection, done));
}

export function close(connection, ...args){
  return fromNodeCallback(done => connection.close(...args, done));
}

export function reconnect(connection, ...args){
  return fromNodeCallback(done => connection.reconnect(...args, done));
}

export function noReplyWait(connection){
  return fromNodeCallback(done => connection.noReplyWait(done));
}

// for cursors

export function docs(cursor){
  var c = chan();
  go(function*(){
    let doc;
    while((doc = yield fromNodeCallback(done => cursor.next(done))).message !== 'No more rows in the cursor.') {
      console.log(typeof doc);
      yield put(c, doc);
    }
    c.stop();
  });
  c.stop = ()=> {
    cursor.close();
    c.close();
  };
  return c;
}

export function first(cursor){
  var c = chan();
  go(function*(){
    let doc = yield fromNodeCallback(done => cursor.next(done));
    if(doc){
      yield put(c, doc);
    }
    cursor.close();
    c.close();
  });

  return c;
}

export function toArray(cursor){
  return fromNodeCallback(done => cursor.toArray(done));
}
