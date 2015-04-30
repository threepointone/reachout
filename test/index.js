// need to mock rethinkdb here - 
// need a fake query on which to call .run()
//.connect must return a cursor on which one can call .next()


go(function*(){
  var connection = yield connect(r, db);
  var cursor = yield run(r.db('mydb').table('mytable'), connection);
  var records = yield into([], docs(cursor)))
  log(records);  
})

