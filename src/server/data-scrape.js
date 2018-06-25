import Nightmare from 'nightmare';

// nightmare is a simple wrapper for PhantomJS for web automation and scraping
export function* run() {
  let nightmare = Nightmare({
    show: true
  });
  
  let result = yield nightmare
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
