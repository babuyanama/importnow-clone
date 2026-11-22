
const mysql = require("mysql2");
require("dotenv").config({ path: __dirname + "/.env" });

const db = mysql.createConnection(
  process.env.MYSQL_URL
);

db.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error.message);
    return;
  }

  console.log("MySQL Connected Successfully!");
});

module.exports = db;
