import { modelExists, addModel, addPrice, getAll, getLastPrice } from './db/queries/index';
import { run } from './data-scrape';
import express from 'express';
import vo from 'vo';
// const express = require('express');
const bodyParser = require('body-parser');
// const expressMongoDb = require('express-mongo-db');
const port = process.env.PORT || 3000;
const app = express();
//const vo = require('vo');
//const queries = require('./db/queries/index');
//const ds = require('./data-scrape');


app.use(express.static(__dirname + '/../../react-client/dist'));


/* ON PAGE LOAD */
/** CREATE GET '/' handler to retrieve price data from db to send to client **/
app.get('/data', async (req, res) => {
  // Query db for All records
  let result = await getAll();
  //console.log('Get all result: ', result);
  // Send all records in response

  res.send(result);

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

      // If model does Not exist in 'models' table
      if(!modelExistsInModelsTable) {
        // add model, title, image-url to 'models' table
        let resultaddModel = await addModel(model, title);
        console.log('Add Model Success: ', resultaddModel);
      } else { // if model Does exist in 'models' table, get the Last Price
        // get model id from 'models' table

        /* If 'modelExistsInModelsTable' is truthy, it equals an array, from the db models
          table, contianing the model id at index 0  */
        let modelIdFromDb = modelExistsInModelsTable[0].id;

        //////////// Check Last Price in DB ////////////
        // Get last price for current model from db using its model id
        let lastPriceObj = await getLastPrice(modelIdFromDb);
        let lastPrice = lastPriceObj[0].price;
        console.log('Retrieved last price: ', lastPriceObj[0].price);
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
      //////////// Add latest tv price to DB  ////////////
      // invoke 'addPrice()' query with model name, price, and flag passed      
      let resultAddPrice = await addPrice(model, price, flag);
      console.log('Add New Price Success: ', resultAddPrice);
    }
  });
}, 200000000); // 21600000, Every 6 Hours | *15000000 Every 4.16 hours | 300K, Every 5 minutes | 75K 1.25 min



const server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

module.exports = server;