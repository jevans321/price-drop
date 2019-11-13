const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');
require('dotenv').config();
module.exports = {
  test: {
    client: 'mysql',
    connection: `mysql://${process.env.DB_USER}@${process.env.DB_HOST}/p_drop_test`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'mysql',  
    connection: `mysql://${process.env.CLEARDB_USER}:${process.env.CLEARDB_PASS}@${process.env.CLEARDB_HOST}/heroku_671b31482e21aac?reconnect=true`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};