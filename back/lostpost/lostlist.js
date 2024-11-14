const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  charset: "utf8mb4", // utf8mb4 설정
  debug: false,
});
router.get("/lost-item-list", (req, res) => {
  pool.query("SELECT * FROM lostlist", (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    const items = results.map((item) => ({
      id: item.no, // Ensure 'id' is 'item.no' from the database
      name: item.name,
      place: item.StorageLocation,
      upload_date: item.upload_date,
      image: item.image
        ? `data:image/png;base64,${Buffer.from(item.image).toString("base64")}`
        : null,
    }));

    res.status(200).json(items);
  });
});
module.exports = router;
