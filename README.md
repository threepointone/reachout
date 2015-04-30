(alpha)

reachout
---
dahi + rethinkdb

`npm install reachout`

```js
// the basics


go(function*(){
  var connection = yield connect(r, db);
  var cursor = yield run(r.db('mydb').table('mytable'), connection);
  var records = yield into([], docs(cursor)))
  log(records);  
})

// works with changes()!


```

(re: error handling - follow [this issue](https://github.com/ubolonton/js-csp/issues/14))