import mysql from "mysql2";
import env from "dotenv";
const result = env.config();

export const db = mysql.createConnection({
  host: result.parsed.DB_HOST || "localhost",
  user: result.parsed.DB_USER,
  password: result.parsed.DB_PASSWORD,
  database: result.parsed.DB_NAME,
});
