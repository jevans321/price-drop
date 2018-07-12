# Price-Drop
### About
This application checks a popular electronics site multiple times a day for any price updates on its televisions. The data is scraped using the Nightmare.js browser-automation library. All the pricing data is stored in a MySQL database. If there is a price drop or increase, that particular television is flagged.
When the client section of the site is visited through a browser, the pricing data is retreived from the database and is displayed in graph and table formats.
Only CSS3 was used for styling.

![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_table_07092018.jpg)

### Tech Stack:
* Nightmare.js
* Node.js
* Express
* MySQL
* React
* CSS Grid
* Knex
* Axios
* DataTables
* Babel.js

### Future Additions
* Email Notification of price drops
* Additional sites for data scraping

### Database MySQL Schema (Knex syntax):
[github.com/jevans321/Price-Drop/blob/master/src/server/db/migrations/20180526005527_create_model_and_price_tables.js](https://github.com/jevans321/Price-Drop/blob/master/src/server/db/migrations/20180526005527_create_model_and_price_tables.js)

### Data Scraper:
[github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js)

### Database Queries:
[github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js)

### Dashboard
![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_dashbord_07092018.jpg)