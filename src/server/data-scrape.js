import Nightmare from 'nightmare';
import path from 'path';
const useragents = ['Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3015.0 Safari/537.36'];

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
// nightmare is a simple wrapper for PhantomJS for web automation and scraping
export function* run() {
  let nightmare = Nightmare({
    show: true,
    webPreferences: {
      webSecurity: true,
      preload: path.resolve(__dirname + '/preload.js')
    }
  });

  // https://www.target.com/c/tvs-home-theater-electronics/55-inch/-/N-5xtdjZ6hv8p?type=products&lnk=55TVs
  let result = yield nightmare
    .useragent(useragents[getRandomInt(0, useragents.length - 1)])
    .goto('https://www.bestbuy.com/site/tvs/55-inch-tvs/pcmcat1514910111435.c?id=pcmcat1514910111435&qp=brand_facet%3DBrand~Samsung%5Ebrand_facet%3DBrand~Sony%5Ebrand_facet%3DBrand~VIZIO')
    .wait(2000)

    // scroll down page bit by bit to allow content to load
  	.scrollTo(16000, 0)
    .wait(2000)
  	.scrollTo(19000, 0)
    .wait(2000)

    .evaluate(() => {
      // let hash = {};
      // // traverse DOM tree and add properties to hash
      // $('.ProductCard-infoSection-3496717424').each(function() {
      //   let tvCard = $(this).find('.ProductName-title-3304727955').text();
      //     hash[tvCard] = {
      //       "title": $(this).find('.ProductName-title-3304727955').text(),
      //       "price": $(this).find('.Product-card__price-current').text()
      //     };
      // })

      /*  Creating a hashTable...
            Key: Model Number
            Value: is an object that contains the title, model, and price
      */
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

  yield nightmare.end();
  return result;
};
