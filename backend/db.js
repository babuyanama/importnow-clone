
const mysql = require("mysql2");

require("dotenv").config({ path: __dirname + "/.env" });

let db;

if (process.env.MYSQL_URL) {
  // Railway database connection
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  // Local MySQL connection
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

db.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error.message);
    return;
  }

  console.log("MySQL Connected Successfully!");
});

module.exports = db;
