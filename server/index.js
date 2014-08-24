var koa = require('koa'),
  serve = require('koa-static');

var fs = require('fs');

var app = koa();

if (app.env === 'development') {
  //DEVELOPMENT SERVER
  app.use(serve(require('../build.config.js').devDir));
  app.use(serve('client'));
  app.use(require('koa-browser-sync')());
} else {
  //PRODUCTION SERVER
  app.use(serve(require('../build.config.js').devDir));
  app.use(serve('client'));

  // app.use(serve('dist'));
}

// the /sarees route
app.use(function * (next) {
  if (this.path !== '/sarees') return yield next;

  this.body = [{"id":1,"type":"designer","price":180,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":2,"type":"designer","price":90,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":3,"type":"cotton","price":80,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":4,"type":"cotton","price":180,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":5,"type":"silk","price":90,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":6,"type":"designer","price":670,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":7,"type":"designer","price":250,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":8,"type":"silk","price":230,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":9,"type":"designer","price":110,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":10,"type":"silk","price":200,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":11,"type":"silk","price":210,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":12,"type":"silk","price":290,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":13,"type":"silk","price":150,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":14,"type":"cotton","price":250,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
{"id":15,"type":"silk","price":220,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"}]
;
})

app.listen(3000);


/*var Pgb = require('pg-bluebird');

var databaseString = 'postgres://azybppbjwfpzfk:1dN6QC-L4FOLpfRJPyMADGNdT0@ec2-54-204-42-135.compute-1.amazonaws.com:5432/df962mbll3tsok';

var pgb = new Pgb();

var cnn;
pgb.connect(databaseString)
  .then(function(connection) {
    cnn = connection;
    return cnn.client.query('SELECT * FROM SAREES');
  })
  .then(function(result) {
    console.log(result.rows);
    cnn.client.end();
  })
  .catch(function(error) {
    console.log('There was an error!');
    console.log(error);
  });
*/
