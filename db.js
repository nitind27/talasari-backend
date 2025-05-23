// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // or your DB host
  user: 'root',           // your MySQL username
  password: '',           // your MySQL password ('' if none)
  database: 'talasari' // your database name
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected!');
});

module.exports = db;
