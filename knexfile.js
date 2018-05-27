const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');
require('dotenv').config();

module.exports = {
  test: {
    client: 'mysql',
    //connection: 'localhost:3306' || { user: 'root', database: 'p_drop_test'},
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
    //connection: 'localhost:3306' || { user: 'root', database: 'p_drop'},    
    connection: `mysql://${process.env.DB_USER}@${process.env.DB_HOST}/p_drop`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};