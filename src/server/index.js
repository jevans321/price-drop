import { modelExists, addModel, addPrice, getAll, getLastPrice } from './db/queries/index';
// import { run } from './data-scrape';
import express from 'express';
// import vo from 'vo';
import http from "http";

const sendmail = require('sendmail')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();
import Nightmare from 'nightmare';
import path from 'path';
const useragents = ['Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3015.0 Safari/537.36'];

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const nightmare = Nightmare({
  show: true,
  webPreferences: {
    webSecurity: true,
    preload: path.resolve(__dirname + '/preload.js')
  }
});

/* Re-activate Heroku Dynos
  The @setInterval callback function below calls the site every 5 minutes
    to keep the dynos active.
  If the site sits idle, the dynos will deactivate and put the site to 
    sleep, and then the scraper won't run.
*/
setInterval(function() {
  http.get("http://pdrop.herokuapp.com");
}, 300000); // every 5 minutes (300000)

app.use(express.static(__dirname + '/../../react-client/dist/'));

/* ON PAGE LOAD */
/** CREATE GET '/' handler to retrieve price data from db to send to client **/
app.get('/data', async (req, res) => {
  // Query db for All records
  let result = await getAll();
  // Send all records in response
  res.send(result);

});

/** SCHEDULED SCRAPE FUNCTION, to run scraper function 3+ times/daily  **/
setInterval(() => {
    nightmare
    .useragent(useragents[getRandomInt(0, useragents.length - 1)])
    .goto('https://www.bestbuy.com/site/tvs/55-inch-tvs/pcmcat1514910111435.c?id=pcmcat1514910111435&qp=brand_facet%3DBrand~Samsung%5Ebrand_facet%3DBrand~Sony%5Ebrand_facet%3DBrand~VIZIO')
    .wait(2000)
  
    // scroll down page bit by bit to allow content to load
    .scrollTo(16000, 0)
    .wait(2000)
    .scrollTo(19000, 0)
    .wait(2000)
    .evaluate(() => {
  
        let hash = {};
        $('.sku-item').each(function() {
          let tvModel = $(this).find('.sku-value').first().text().trim(); // the trim() removes whitespace from both ends
            hash[tvModel] = {
              "title": $(this).find('.sku-header').text(),
              "model": tvModel,
              "price": $(this).find('.priceView-customer-price span').first().text()
            };
        })
        return hash;
      })
    .end()
    .then(result => {

      let newScrapedDataObject = result;
      // Scrape site, get new data
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
          // if last price or current price is null skip to adding the values to the DB
          if((lastPrice === null || lastPrice.length === null) || (price === null || price.length === null)) {
          
            // convert stringified prices to numbers
            let priceNum = Number(price.replace(/[$,]/g, ""));
            lastPrice = Number(lastPrice.replace(/[$,]/g, ""));

            // if new price is less than last price in prices table
            if(priceNum < lastPrice) {        
              /** send email notification of Price Drop **/
              // set drop flag to '1' color red(?)
              flag = 1;

              let priceDifference = lastPrice - priceNum;
              // send email notification
              sendmail({
                from: 'you@pricedrop.com',
                to: 'james3780@gmail.com',
                subject: `PRICE DROP: ${title.slice(0,9)} Drop: $${priceDifference} Current: $${price}`,
                html: `<h3>PRICE DROP ALERT</h3>
                <p>TV: ${title}</p>
                <p>Model: ${model}</p>
                <p style="font-size: large">Price Drop: <strong>$${priceDifference}</strong></p>
                <p style="font-size: large">Previous Price: <strong>$${lastPrice}</strong>, Current Price: <strong><span style="color: red">$${priceNum}</span></strong></p>`,
              }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
              });
            // if new price is greater than last price in prices table
            } else if(priceNum > lastPrice) {
              // set drop flag to '2' color orange(?)
              flag = 2;
            // if new price is same, flag remains zero
            }
            // if prices are equal, flag will remain '0'
          }
        }
        //////////// Add latest tv price to DB  ////////////
        // if model already exists and no price was scraped, don't add empty price to DB
        if(modelExistsInModelsTable && (price === null || price.length === null)) {
          console.log('Empty Price, no price added to DB');
          continue;
        }
        // invoke 'addPrice()' query with model name, price, and flag passed      
        let resultAddPrice = await addPrice(model, price, flag);
        console.log('Add New Price Success: ', resultAddPrice);
      }
    })
    .catch(error => {
      console.error('Scrape Error: ', error)
    })
}, 150000); // 21600000, Every 6 Hours | *15000000 Every 4.16 hours | 300K, Every 5 minutes | 150K, 2.5min 75K 1.25 min



const server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

module.exports = server;