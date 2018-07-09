# Price-Drop
This is an application that scrapes tv product data from the Samsung site and checks for any price fluctuations, then stores all the data in a MySQL database.

![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_dashbord_prv_07092018.jpg)

### About
This application checks the Samsung site multiple times a day for any price updates on its televisions. The data is scraped using the Nightmare.js browser-automation library. All the pricing data is stored in a MySQL database. If there is a price drop or increase, that particular television is flagged.
When the client section of the site is visited through a browser, the pricing data is retreived from the database and is displayed in graph and table formats.
Only CSS3 was used for styling.

### Future Additions
Email Notification of price drops
Additional sites for data scraping


### Tech Stack:
* Node.JS
* Express
* MySQL
* React
* CSS Grid
* Nightmare.js
* Axios
* DataTables

### Data Scraper:
[github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/data-scrape.js)


### Database Queries:
[github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js
](https://github.com/jevans321/Price-Drop/blob/master/src/server/db/queries/index.js)

### Dashboard
![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_dashbord_07092018.jpg)

### Price Table
![alt text](https://github.com/jevans321/Price-Drop/blob/master/react-client/dist/assets/pdrop_table_07092018.jpg)