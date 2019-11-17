import knex from '../connection';

/*** ------------- MySQL Queries ------------- ***/

/* Check if model exists in 'models' table */
// Return boolean
function modelExists(modelParam) {
  /* Possible faster query syntax:
      * SELECT TOP 1 products.id FROM products WHERE products.id = ?;
     Raw query:
      * `SELECT EXISTS(SELECT models.id FROM models WHERE models.model = ${modelParam})`
  * */
  let inner = knex('models').select('id').where('model', modelParam);
  return knex.raw(inner)
  .wrap('select exists (', ')')
  .then((knexResponse) => {
    let exists = knexResponse[0][0][knexResponse[1][0].name];
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
}

/* Retrieve ALL records from 'prices' table */
// Return records
function getAll() {
  console.log("inside getAll function");
  return knex('prices')
  .innerJoin('models', 'prices.model_id', 'models.id')
  .select('prices.price', 'prices.flag', 'prices.date', 'models.model', 'models.title')
  .catch(err => {
    console.log('GetAll Error: ', err);
  });
}

/* Retrieve Last price for specific model_id from 'prices' table */
// Return price
function getLastPrice(modelIdParam) {
  /* 
    Raw query:
    * knex.raw('select price from prices where id = (select  MAX(id) from prices where model_id = ?', modelIdParam)
  * */

  /* The record with the max ID (MAX(id)) is being selected.
     Since there could be multiple records that share the same model ID input val,
     The most recent record is being selected because it will have the largest ID num */
  return knex('prices')
  .where({id: knex('prices').select(knex.raw('MAX(id)')).where({model_id: modelIdParam})})
  .select('price')
  .catch(err => {
    console.log('Error: ', err);
  });
}

export { modelExists, addModel, addPrice, getAll, getLastPrice };