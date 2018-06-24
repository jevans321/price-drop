const knex = require('../connection');
// knex.raw(`INSERT INTO models (model, title, image) VALUES("1model", "1title", "1image")`).catch(err => {
//   console.log(err);
//   process.exit(1);
// });
/*** ------------- MySQL Queries ------------- ***/

/* Check if model exists in 'models' table */
// Return boolean
function modelExists(modelParam) {
  // e.g. SELECT TOP 1 products.id FROM products WHERE products.id = ?;
  let inner = knex('models').select('id').where('model', modelParam);
  //let inner = `SELECT EXISTS(SELECT models.id FROM models WHERE models.model = ${modelParam})`;
  return knex.raw(inner)
  .wrap('select exists (', ')')
  .then((knexResponse) => {
    // console.log('knexResponse variable: ', knexResponse);
    let exists = knexResponse[0][0][knexResponse[1][0].name];
    // console.log('Exists variable: ', exists);
    if(exists) {
      // return id object
      return inner;
    } else {
      return false;
    }
  })
  .catch(err => {
    console.log('Error: ', err);
  });
  
}

/* Insert model into 'models' table */
// Return success notification
function addModel(modelParam, titleParam, imageParam) {
  // console.log('2: inside addModel');
  return knex('models')
  .returning(['id', 'model', 'title']) // these columns do not return in MySQL
  .insert({model: modelParam, title: titleParam, image: imageParam})
  .catch(err => {
    console.log('Error: ', err);
  });
  // Raw e.g. knex.raw(`INSERT INTO models (model, title, image) VALUES(${modelParam}, ${titleParam}, ${imageParam})`)
}

/* Insert price into 'prices' table */
// Return success notification
function addPrice(modelNameParam, priceParam, flagParam) {
  // console.log('3: inside addPrice');
  return knex('prices')
  .returning(['id', 'model_id', 'price', 'flag', 'date']) // these columns do not return in MySQL
  .insert({model_id: knex('models').where({model: modelNameParam}).select('models.id'), price: priceParam, flag: flagParam, date: new Date()})
  .catch(err => {
    console.log('Error: ', err);
  });
  // Raw e.g. (select models.id from models where model = 'scrapedModel')
}

/* Retrieve ALL records from 'prices' table */
// Return records
function getAll() {
  return knex('prices')
  .innerJoin('models', 'prices.model_id', 'models.id')
  .select('prices.price', 'prices.flag', 'prices.date', 'models.model', 'models.title')
  .catch(err => {
    console.log('Error: ', err);
  });
}

/* Retrieve Last price for specific model_id from 'prices' table */
// Return price
function getLastPrice(modelIdParam) {
  return knex('prices')
  .where({id: knex('prices').select(knex.raw('MAX(id)')).where({model_id: modelIdParam})})
  .select('price')
  .catch(err => {
    console.log('Error: ', err);
  });
  // select price from prices where id = (select  MAX(id) from prices where model_id = 32)
  // knex.raw('select price from prices where id = (select  MAX(id) from prices where model_id = ?', modelIdParam)
}

export { modelExists, addModel, addPrice, getAll, getLastPrice };


  // On page-load Query to get data from joined tables and send to client


  // After auto-scrape, Query to add data collected from scrape
  // addTvData: (modelParam, priceParam, titleParam, imageParam) => {
  //   let returnVal = knex('prices')
  //   .returning(['id', 'ip', 'region'])
  //   .insert({model_id: knex.raw(`select model_id from models where model = ${modelParam}`), price: priceParam, date: new Date()})
    
  //   // if model_id returns null
  //   if(returnVal === null) {
  //     // insert tv model into 'models' table
  //     knex('models')
  //     .insert({model: modelParam, title: titleParam, image: imageParam})

  //     // then do the 'prices' table insert again
  //     return knex('prices')
  //     .returning(['id', 'ip', 'region'])
  //     .insert({model_id: knex.raw(`select model_id from models where model = ${modelParam}`), price: priceParam, date: new Date()})
    
  //   } else {
  //     return returnVal;
  //   }
  // }



/*
insert into "order" (customer_id, price) values \
((select customer_id from customer where name = 'John'), 12.34);
 
insert into customer(name) values ('John');
insert into "order" (customer_id, price) values \
((select customer_id from customer where name = 'John'), 12.34);

*/