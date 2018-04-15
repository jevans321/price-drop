var fs = require('fs');

var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true
  })
// nightmare is a simple wrapper for PhantomJS for web automation and scraping

module.exports.run = function*() {
  yield nightmare.goto('https://www.samsung.com/us/televisions-home-theater/tvs/all-tvs/s/_/n-10+11+hv1uh/')
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

  	.inject('js', 'jquery.min.js')


  yield nightmare.evaluate(function() {
    //return $('.info').text()
    //var json = [];
    var json = {};
    // create an array to hold all json gathered by following code
    $('.ProductCard-infoSection-2332077118').each(function() {
      var tvCard = $(this).find('.ModelCode-modelCode-2117711199').text();
        json[tvCard] = {
          "title": $(this).find('.type-cp1').text(), // { title: text }, { title: text }
          "model": $(this).find('.ModelCode-modelCode-2117711199').text(),
          "price": $(this).find('.Product-card__price-current').text()
        }
        // item["title"] = $(this).find('.type-cp1').text() // { title: text }, { title: text }
        // item["model"] = $(this).find('.ModelCode-modelCode-2117711199').text()
        // item["price"] = $(this).find('.PriceInfo-price-2355885634').text()

        // json.push(item)
      })

    return json;
      // pass the json array forward so it can be looped through later on
  })
  // you now have a fresh newly created json container that contains all the tv items
  // compare this to a json storage container
  // make a copy of the container some how

  //var storage = yield nightmare.evaluate(function() {
  	// set variable objects equal to emtpy array
  	// loop through each object in target array
  	  // push object into objects array

  //})

    .end()
    .then(function(result) {
       console.log('Result: ', result);
      // for (gig in result) {
      //   console.log(result[gig].title)
      //   console.log(result[gig].model)
      //   console.log(result[gig].price)
      //   console.log("\n")
      // }
      // print each gig to the console in a neat format

      // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      // 	if(err) return console.log(err);
    	//   console.log('File successfully written! - Check your project directory for the output.json file');

		  // })
    })

};
