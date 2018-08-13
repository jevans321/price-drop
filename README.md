# Price-Drop
### About
Price-Drop is a price monitoring application that checks a popular electronics site multiple times a day for any price updates on its televisions. The data is scraped using the Nightmare.js browser-automation library. All the pricing data is stored in a MySQL database. If there is a price drop or increase, that particular television is flagged and an email notification is sent.
When the client section of the site is visited through a browser, the pricing data is retrieved from the database and is displayed in graph and table formats.
Only CSS3 was used for styling.

![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_dashbord_07232018.jpg)

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

### Deployment
* Heroku
* AWS RDS MySQL
* [pdrop.herokuapp.com](https://pdrop.herokuapp.com){:target="_blank"}

### Data Scraper:
[github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js){:target="_blank"}

### Database Queries:
[github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js){:target="_blank"}

### Database MySQL Schema (Knex syntax):
[github.com/jevans321/Price-Drop/blob/master/src/server/db/migrations/20180526005527_create_model_and_price_tables.js](https://github.com/jevans321/Price-Drop/blob/master/src/server/db/migrations/20180526005527_create_model_and_price_tables.js){:target="_blank"}

### Price Monitor Table
![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_table_07232018.jpg)