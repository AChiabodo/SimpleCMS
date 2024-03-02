'use strict';
/* Data Access Object (DAO) module for accessing users */

const crypto = require('crypto');


const mysql = require('mysql');

const con = mysql.createConnection({
  host: '192.168.1.234',
  user: 'alessandro',
  password: 'scricciolo',
  database: 'CMS'
});

con.connect((err) => {
  if (err) throw err;
  console.log('User Connected to MySQL');
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
      con.query(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          row = row[0];
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.id, username: row.email, name: row.name , role : row.Role}
          resolve(user);
        }
    });
  });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      con.query(sql, [email], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          row = row[0];
          const user = {id: row.id, username: row.email, name: row.name, role : row.Role};
          
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);
            console.log(row)
            const passwordHex = Buffer.from(row.hash, 'hex');
            
            if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
              resolve(false);
            else resolve(user); 
          });
        }
      });
    });
  };
  
  exports.getUserByUsername = (name) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE name = ?';
        con.query(sql, [name], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            row = row[0];
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
            const user = {id: row.id, username: row.email, name: row.name , role : row.Role}
            resolve(user);
          }
      });
    });
  };
  
