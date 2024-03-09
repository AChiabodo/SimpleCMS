import { db } from "../db.js";

// Retrieves categories from a database
export const getCategories = (req, res) => {
  // Use the database object to query the database for all categories
  db.query("SELECT * FROM categories", (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};