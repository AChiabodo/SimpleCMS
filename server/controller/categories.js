import { db } from "../db.js";

// Retrieves categories from a database
export const getReviewCategories = (req, res) => {
  // Use the database object to query the database for all categories
  db.query("SELECT * FROM categories WHERE type='review'", (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};
export const getNewsCategories = (req, res) => {
  // Use the database object to query the database for all categories
  db.query("SELECT * FROM categories WHERE type='news'", (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};
// Retrieves categories from a database
export const getPlatforms = (req, res) => {
  // Use the database object to query the database for all categories
  db.query("SELECT * FROM platforms", (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);
    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};

export const createCategory = (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, data) => {
    if (err) return res.status(500).send
    (err);
    return res.status(200).json("Category has been created");
  }
  );
}