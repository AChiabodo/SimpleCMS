import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "192.168.1.234",
  user: "alessandro",
  password: "scricciolo",
  database: "blog_app",
});
