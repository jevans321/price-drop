import { modelExists, addModel, addPrice, getAll, getLastPrice } from './db/queries/index';
import { run, glam } from './data-scrape';
const express = require('express');
const bodyParser = require('body-parser');
// const expressMongoDb = require('express-mongo-db');
const port = process.env.PORT || 3000;
const app = express();
const vo = require('vo');
//const queries = require('./db/queries/index');
//const ds = require('./data-scrape');

// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// const items = require('../database-mysql');
// const items = require('../database-mongo');

// setTimeout(() => {
//   vo(run)((err, result) => {
//     // Scrape site, get new data
//     console.dir(err);
//     console.log('This is VO result: ', result);
//   });
// }, 2000);



// app.use(expressMongoDb('mongodb://localhost/pricedrop'));

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

// app.get('/', (req, res) => res.send({
//   status: 'success',
//   message: 'hello, world!'
// }));
//console.log('Invoke addModel');
// addModel('ModelTestXXJYJ', 'Model_Title', 'httpImageTestUrl');

/* ON PAGE LOAD */
/** CREATE GET '/' handler to retrieve price data from db to send to client **/
app.get('/', async (req, res) => {

  // Query db for All records
  let result = await getAll();
  console.log('Get all result: ', result);
  // Send all records in response

  // try {
  //   console.log('1: About to add model and price');
  //   let resultaddModel = await addModel('2model', '2title', '2image');
  //   console.log('Result - Add Success I think: ', resultaddModel);
  //   let resultAddPrice = await addPrice('2model', '$9000');
  //   console.log('Result - Add Success I think: ', resultAddPrice);
  // } catch (err) {
  //   console.log('error: ', err);
  // }
  // res.send({
  //   prop1: 'value',
  //   prop2: 'value'
  // })
});

/** CREATE A SCHEDULED RUN FUNCTION HERE, to run scraper function 3+ times/daily  **/
// Every 6 Hours

setTimeout(() => {
  vo(run)(async (err, result) => {
    let newScrapedDataObject = result;
    // Scrape site, get new data
    console.dir(err);
    console.log('This is VO result: ', result);
        
    // Loop through scraped data object
    for(let tvProp in newScrapedDataObject) {
      // Add data to db
      let model = newScrapedDataObject[tvProp].model;
      let title = newScrapedDataObject[tvProp].title;
      let price = newScrapedDataObject[tvProp].price;
      let flag = 0;
      let image;
 
      // const tempScheduled = async () => {

      //let modelName = 'BlueBirdX90';
      // variable either id object or false
      let modelExistsInModelsTable = await modelExists(model);
      /* The modelExists query returns an array. This array contains a 'RowDataPacket' object at index 0
        that contains a single key/value pair.
        The Value is either 1 for true 'the modelName exists' or 0 for false 'the modelName does not exist
        The Key is a select string e.g. 'exists (select `id` from `models` where `model` = \'RedBirdX90\')'.
        So instead of typing that entire string out, there is another array at index 1 that contains an
        object with a property 'name'. That properties value is identical to the 'select string'. There are
        many nested quotes in the select string along with a dynamic variable and I was having issues making
        it work, so it was easier to use the name property
      * */

      // let modelExistsBoolean = modelExistsDbDataArray[0][0][modelExistsDbDataArray[1][0].name];
      // console.log('Exists? ', modelExistsBoolean);

      // If model does Not exist in 'models' table
      if(!modelExistsInModelsTable) {
        // add model, title, image-url to 'models' table
        let resultaddModel = await addModel(model, title);
        console.log('Result - Add Success I think: ', resultaddModel);
      } else { // if model Does exist in 'models' table, get the Last Price
        // get model id from 'models' table

        /* If 'modelExistsInModelsTable' is truthy, it equals an array, from the db models
          table, contianing the model id at index 0  */
        let modelIdFromDb = modelExistsInModelsTable[0].id;
        // Query get Last Price
        // Get last price for current model from db using its model id
        let lastPriceObj = await getLastPrice(modelIdFromDb);
        let lastPrice = lastPriceObj[0].price;
        console.log('last price: ', lastPriceObj[0].price);
        // convert stringified prices to numbers
        let priceNum = Number(price.replace(/[$,]/g, ""));
        lastPrice = Number(lastPrice.replace(/[$,]/g, ""));

        // if new price is less than last price in prices table
        if(priceNum < lastPrice) {        
          /** send email notification of Price Drop **/
          // set drop flag to '1' color red(?)
          flag = 1;
        // if new price is greater than last price in prices table
        } else if(priceNum > lastPrice) {
          // set drop flag to '2' color orange(?)
          flag = 2;
        // if new price is same, flag remains zero
        }
        // if prices are equal, flag will remain '0'
      }
      // invoke 'addPrice()' query with model name, price, and flag passed
      let resultAddPrice = await addPrice(model, price, flag);
      console.log('Result - Add Success I think: ', resultAddPrice);
    // } end of temptScheduled function
    }
  });
}, 3000); // 21600000, Every 6 Hours



const server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

module.exports = server;