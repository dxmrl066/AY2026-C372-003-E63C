const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'RP738964$',
  database: 'petcare',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = connection;
