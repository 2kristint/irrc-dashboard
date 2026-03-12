const mysql = require("mysql2");

// Create a connection to the database using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your application's needs
  queueLimit: 0,
});

module.exports = db.promise(); // Export the db connection
