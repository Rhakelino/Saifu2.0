const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

console.log("DB URL:", process.env.DATABASE_URL ? "Exists" : "Missing");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT * FROM wallets', (err, res) => {
  if (err) {
    console.error("Error querying wallets:", err);
  } else {
    console.log("Wallets:", res.rows);
  }
  
  pool.query('SELECT * FROM transactions LIMIT 5', (err2, res2) => {
    if (err2) {
      console.error("Error querying transactions:", err2);
    } else {
      console.log("Transactions:", res2.rows);
    }
    pool.end();
  });
});
