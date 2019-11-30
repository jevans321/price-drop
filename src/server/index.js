import { modelExists, addModel, addPrice, getAll, getLastPrice } from './db/queries/index';
// import { run } from './data-scrape';
import express from 'express';
// import vo from 'vo';
import http from "http";
import puppeteer from 'puppeteer';

const sendmail = require('sendmail')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();


/* Re-activate Heroku Dynos
  The @setInterval callback function below calls the site every 5 minutes
    to keep the dynos active.
  If the site sits idle, the dynos will deactivate and put the site to 
    sleep, and then the scraper won't run.
*/
setInterval(function() {
  http.get("http://pricedropped.herokuapp.com");
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
setInterval(async () => {
  // (async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    try {
      const page = await browser.newPage();
      const url = 'https://www.bestbuy.com/site/tvs/55-inch-tvs/pcmcat1514910111435.c?id=pcmcat1514910111435&qp=brand_facet%3DBrand~Samsung%5Ebrand_facet%3DBrand~Sony%5Ebrand_facet%3DBrand~VIZIO';
      
      // await page.goto(url, {waitUntil: 'load', timeout: 0});
      await page.setDefaultNavigationTimeout(0);
      await page.goto(url);

      let result = await page.evaluate(() => {
        let hash = {};
        let skuItems = document.querySelectorAll('.sku-item');
        skuItems.forEach(item => {
          let tvModel = item.querySelector('.sku-value').innerText;
          let price = null;
          if(item.querySelector('.priceView-customer-price span')) {
            price = item.querySelector('.priceView-customer-price span').innerText
          } else {
            price = "not available";
          }
            hash[tvModel] = {
              "title": item.querySelector('.sku-header').innerText,
              "model": tvModel,
              "price": price
            };
        });
        return hash;
      });

      let newScrapedDataObject = result;

      console.log('This is Puppeteer result: ', result);
      return;
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
          // if last price or current price is not available skip to adding the values to the DB
          if(lastPrice !== "not available" && price !== "not available") {
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
        if(modelExistsInModelsTable && price === "not available") {
          console.log('Empty Price, no price added to DB');
          return;
        }
        // invoke 'addPrice()' query with model name, price, and flag passed      
        let resultAddPrice = await addPrice(model, price, flag);
        console.log('Add New Price Success: ', resultAddPrice);
      }


    } catch (err) {
      console.error("Puppeteer Error: ", err.message);
    } finally {
      await browser.close();
    }
  // })();
}, 100000); // 21600000, Every 6 Hours | *15000000 Every 4.16 hours | 300K, Every 5 minutes | 150K, 2.5min 75K 1.25 min
// 2000000 33min



/** SCHEDULED SCRAPE FUNCTION, to run scraper function 3+ times/daily  **/
// setInterval(() => {
//   vo(run)(async (err, result) => {
//     if(err) {
//       console.log("Scrape Error: ", err);
//       return;
//     }
//       let newScrapedDataObject = result;
//       // Scrape site, get new data
//       console.dir('This is VO result: ', result);
//       // Loop through scraped data object
//       for(let tvProp in newScrapedDataObject) {
//         // Add data to db
//         let model = newScrapedDataObject[tvProp].model;
//         let title = newScrapedDataObject[tvProp].title;
//         let price = newScrapedDataObject[tvProp].price;
//         let flag = 0;
//         let image;
  
//         // variable either id object or false
//         let modelExistsInModelsTable = await modelExists(model);
//         /* The modelExists query returns an array. This array contains a 'RowDataPacket' object at index 0
//           that contains a single key/value pair.
//           The Value is either 1 for true 'the modelName exists' or 0 for false 'the modelName does not exist
//           The Key is a select string e.g. 'exists (select `id` from `models` where `model` = \'RedBirdX90\')'.
//           So instead of typing that entire string out, there is another array at index 1 that contains an
//           object with a property 'name'. That properties value is identical to the 'select string'. There are
//           many nested quotes in the select string along with a dynamic variable and I was having issues making
//           it work, so it was easier to use the name property
//         * */

//         // If model does Not exist in 'models' table
//         if(!modelExistsInModelsTable) {
//           // add model, title, image-url to 'models' table
//           let resultaddModel = await addModel(model, title);
//           console.log('Add Model Success: ', resultaddModel);
//         } else { // if model Does exist in 'models' table, get the Last Price
//           // get model id from 'models' table

//           /* If 'modelExistsInModelsTable' is truthy, it equals an array, from the db models
//             table, contianing the model id at index 0  */
//           let modelIdFromDb = modelExistsInModelsTable[0].id;

//           //////////// Check Last Price in DB ////////////
//           // Get last price for current model from db using its model id
//           let lastPriceObj = await getLastPrice(modelIdFromDb);
//           let lastPrice = lastPriceObj[0].price;
//           console.log('Retrieved last price: ', lastPriceObj[0].price);
//           // if last price or current price is not available skip to adding the values to the DB
//           if(lastPrice !== "not available" && price !== "not available") {
//             // convert stringified prices to numbers
//             let priceNum = Number(price.replace(/[$,]/g, ""));
//             lastPrice = Number(lastPrice.replace(/[$,]/g, ""));

//             // if new price is less than last price in prices table
//             if(priceNum < lastPrice) {        
//               /** send email notification of Price Drop **/
//               // set drop flag to '1' color red(?)
//               flag = 1;

//               let priceDifference = lastPrice - priceNum;
//               // send email notification
//               sendmail({
//                 from: 'you@pricedrop.com',
//                 to: 'james3780@gmail.com',
//                 subject: `PRICE DROP: ${title.slice(0,9)} Drop: $${priceDifference} Current: $${price}`,
//                 html: `<h3>PRICE DROP ALERT</h3>
//                 <p>TV: ${title}</p>
//                 <p>Model: ${model}</p>
//                 <p style="font-size: large">Price Drop: <strong>$${priceDifference}</strong></p>
//                 <p style="font-size: large">Previous Price: <strong>$${lastPrice}</strong>, Current Price: <strong><span style="color: red">$${priceNum}</span></strong></p>`,
//               }, function(err, reply) {
//                 console.log(err && err.stack);
//                 console.dir(reply);
//               });
//             // if new price is greater than last price in prices table
//             } else if(priceNum > lastPrice) {
//               // set drop flag to '2' color orange(?)
//               flag = 2;
//             // if new price is same, flag remains zero
//             }
//             // if prices are equal, flag will remain '0'
//           }
//         }
//         //////////// Add latest tv price to DB  ////////////
//         // if model already exists and no price was scraped, don't add empty price to DB
//         if(modelExistsInModelsTable && price === "not available") {
//           console.log('Empty Price, no price added to DB');
//           return;
//         }
//         // invoke 'addPrice()' query with model name, price, and flag passed      
//         let resultAddPrice = await addPrice(model, price, flag);
//         console.log('Add New Price Success: ', resultAddPrice);
//       }
//   });
// }, 200000); // 21600000, Every 6 Hours | *15000000 Every 4.16 hours | 300K, Every 5 minutes | 150K, 2.5min 75K 1.25 min
// 2000000 33min


const server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

module.exports = server;