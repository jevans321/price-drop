var fs = require('fs');
var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true
    // webPreferences: {
    //   "webSecurity": true
    //   }//
  })
  //nightmare.webFrame.registerUrlSchemeAsBypassingCsp("http");
// nightmare is a simple wrapper for PhantomJS for web automation and scraping
// glam is a test function
export function glam() {
  nightmare.goto('https://www.samsung.com/us/televisions-home-theater/tvs/all-tvs/s/_/n-10+11+hv1uh/')
    .wait(2000)

    // scroll down from top of page about a fourth of the way down
    .scrollTo(2000, 0)
    .wait(3000)
    .scrollTo(2500, 0)
    .wait(5000)

    // click 'view more' link at bottom of listings. This will show all listings on page.
    .click('.FooterControlBar-viewMoreButton-1605513253')
    .wait(3000)

    // scroll down page bit by bit to allow content to load
    .scrollTo(7000, 0)
    .wait(3000)
    .scrollTo(8000, 0)
    .wait(3000)
    .scrollTo(11000, 0)
    .wait(2000)
    .scrollTo(14000, 0)
    .wait(2000)
    .scrollTo(16000, 0)
    .wait(2000)
    .scrollTo(19000, 0)
    .wait(2000)

    .evaluate(() => {
      // hash storage
      let hash = {};
      // traverse DOM tree and add properties to hash
      $('.ProductCard-infoSection-2332077118').each(function() {
        let tvCard = $(this).find('.ModelCode-modelCode-2117711199').text();
          hash[tvCard] = {
            "title": $(this).find('.type-cp1').text(), // { title: text }, { title: text }
            "model": $(this).find('.ModelCode-modelCode-2117711199').text(),
            "price": $(this).find('.Product-card__price-current').text()
          }
          // item["title"] = $(this).find('.type-cp1').text() // { title: text }, { title: text }
          // item["model"] = $(this).find('.ModelCode-modelCode-2117711199').text()
          // item["price"] = $(this).find('.PriceInfo-price-2355885634').text()

          //// hash.push(item)
        })

      return hash;
    })
    .end()
    .then((result) => {
      //console.log(title);
      console.log('Result: ', result);

      // Get results object from scrape

      // Loop through each tv in scrape object
        /* Query db 'model' table for tv model */
        // if tv exists in db
          /* Query db 'prices' table for last price of tv */
          // if the new price is Less than the last recorded price in db
            // flag record to be highlighted somehow
            // send email notification of lower price
            // insert new tv record into 'prices' table
          // else if price is same and new date is not same as last date
            // insert new tv record into 'prices' table

        // else if tv DOES NOT exist in db
          // insert new tv into db 'models' table
          // insert new tv into db 'prices' table
    })

}
//
export function* run() {
  var result = yield nightmare
    .goto('https://www.samsung.com/us/televisions-home-theater/tvs/all-tvs/s/_/n-10+11+hv1uh/')
    .wait(2000)

    // scroll down from top of page about a fourth of the way down
    .scrollTo(2000, 0)
    .wait(3000)
    .scrollTo(2500, 0)
    .wait(5000)

    // click 'view more' link at bottom of listings. This will show all listings on page.
  	.click('.FooterControlBar-viewMoreButton-1605513253')
  	.wait(3000)

    // scroll down page bit by bit to allow content to load
  	.scrollTo(7000, 0)
    .wait(3000)
  	.scrollTo(8000, 0)
    .wait(3000)
  	.scrollTo(11000, 0)
    .wait(2000)
  	.scrollTo(14000, 0)
    .wait(2000)
  	.scrollTo(16000, 0)
    .wait(2000)
  	.scrollTo(19000, 0)
    .wait(2000)
    //yield nightmare.end();

  	//.inject('js', 'jquery.min.js')
    .evaluate(() => {
    // hash storage
    let hash = {};
    // traverse DOM tree and add properties to hash
    $('.ProductCard-infoSection-2332077118').each(function() {
      let tvCard = $(this).find('.ModelCode-modelCode-2117711199').text();
        hash[tvCard] = {
          "title": $(this).find('.type-cp1').text(), // { title: text }, { title: text }
          "model": $(this).find('.ModelCode-modelCode-2117711199').text(),
          "price": $(this).find('.Product-card__price-current').text()
        }
        // item["title"] = $(this).find('.type-cp1').text() // { title: text }, { title: text }
        // item["model"] = $(this).find('.ModelCode-modelCode-2117711199').text()
        // item["price"] = $(this).find('.PriceInfo-price-2355885634').text()

        //// hash.push(item)
      })

    return hash;
    })

  yield nightmare.end();
  return result;
  // .then((result) => {
  //   //console.log('Result: ', result);
  //   return result;
  //   // for (gig in result) {
  //   //   console.log(result[gig].title)
  //   //   console.log(result[gig].model)
  //   //   console.log(result[gig].price)
  //   //   console.log("\n")
  //   // }
  //   // print each gig to the console in a neat format

  //   // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
  //   // 	if(err) return console.log(err);
  //   //   console.log('File successfully written! - Check your project directory for the output.json file');

  //   // })
  // })
  // .catch(function(error){
  //   console.error('an error has occurred: ' + error);
  // });
};
