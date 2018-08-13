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

  
  let result = yield nightmare
    .useragent(useragents[getRandomInt(0, useragents.length - 1)])
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

    .evaluate(() => {
      let hash = {};
      // traverse DOM tree and add properties to hash
      $('.ProductCard-infoSection-2332077118').each(function() {
        let tvCard = $(this).find('.ModelCode-modelCode-2117711199').text();
          hash[tvCard] = {
            "title": $(this).find('.type-cp1').text(),
            "model": $(this).find('.ModelCode-modelCode-2117711199').text(),
            "price": $(this).find('.Product-card__price-current').text()
          };
      })
      return hash;
    })

  yield nightmare.end();
  return result;
};
