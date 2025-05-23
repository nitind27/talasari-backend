// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '89.117.188.154',      // or your DB host
  user: 'u743335965_talasari',           // your MySQL username
  password: 'Weclock@1803',           // your MySQL password ('' if none)
  database: 'u743335965_talasari' // your database name
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected!');
});

module.exports = db;
