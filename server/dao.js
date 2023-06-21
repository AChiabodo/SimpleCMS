'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');
const e = require('cors');

// open the database
const db = new sqlite.Database('CMSmall.db', (err) => {
  if (err) throw err;
});
//List all pages
exports.listPages = (published) => {
  return new Promise((resolve, reject) => {
    let sql;
    if (published) {
      sql = 'SELECT pages.id as id , pages.title as title , pages.creationDate as creationDate , pages.publishDate as publishDate , users.name as name , contentBlock.id as cid , contentBlock.Type as ctype , contentBlock.Position as cposition, contentBlock.Content as content FROM pages , users , contentBlock WHERE pages.publishDate <= date(\'now\') and users.id = pages.author and pages.id = contentBlock.page ORDER BY publishDate DESC';

    } else {
      sql = 'SELECT pages.id as id , pages.title as title , pages.creationDate as creationDate , pages.publishDate as publishDate , users.name as name , contentBlock.id as cid , contentBlock.Type as ctype , contentBlock.Position as cposition, contentBlock.Content as content FROM pages , users , contentBlock WHERE users.id = pages.author and pages.id = contentBlock.page ORDER BY publishDate DESC';
    }
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const contents = rows.map((e) => ({ id: e.id, title: e.title, creationDate: dayjs(e.creationDate), publishDate: dayjs(e.publishDate), author: e.name, content_id: e.cid, type: e.ctype, position: e.cposition , content: e.content }))
      const page = contents.reduce((acc, curr) => {
        if (acc.some((x) => x.id === curr.id)) {
          const index = acc.findIndex((x) => x.id === curr.id);
          acc[index].content.push({ id: curr.content_id, type: curr.type, position: curr.position , content: curr.content });
        } else {
          acc.push({
            id: curr.id,
            title: curr.title,
            creationDate: curr.creationDate,
            publishDate: curr.publishDate,
            content: []
          });
        }
        return acc; // add this line to return the accumulator
      }, []);
      resolve(page);
    });
  })
}

// get the page identified by {id}
exports.getPage = (id , onlyPublished = false) => {
  return new Promise((resolve, reject) => {
    let sql;
    if(onlyPublished){
      sql = 'SELECT * FROM pages WHERE pages.id=? and pages.publishDate <= date(\'now\')';
    }else{
      sql = 'SELECT * FROM pages WHERE id=?';
    }
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Page not found.' });
      } else {
        console.log(row);
        const film = { id: row.id, title: row.title, favorite: row.favorite, watchdate: dayjs(row.watchdate), rating: row.rating, user: row.user };
        resolve(film);
      }
    });
  });
};

// get all the contentBlocks for the page identified by {id}
exports.getContent = (idPage,user) => {
  return new Promise((resolve, reject) => {
    let sql;
    if(!user){
      sql = 'SELECT c.id, p.title , c.Content , c.Type , c.Position FROM contentBlock c , pages p WHERE c.page=? and c.page=p.id and p.publishDate <= date(\'now\') order by position';
    }
    else{
      sql = 'SELECT c.id, p.title , c.Content , c.Type , c.Position FROM contentBlock c , pages p WHERE c.page=? and c.page=p.id order by position';
    }
    db.all(sql, [idPage], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Block not found.' });
      } else {
        console.log(row)
        const content = row.map(row => ({ id: row.id, content: row.Content, type: row.Type, position: row.Position }))
        resolve(content);
      }
    });
  });
};

// get all users
exports.listUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const users = rows.map((e) => (
        {
          id: e.id,
          email: e.email,
          name: e.name,
        }));

      resolve(users);
    });
  });
};

// add a new page
exports.createPage = (page) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO pages(title, creationDate,  author , publishDate) VALUES(?, DATE(?), ?, DATE(?))';
    db.run(sql, [page.title, page.creationDate, page.author, page.publishDate], function (err) {
      if (err) {
         
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.createComponent = (component) => {
  console.log(component)
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO contentBlock(page, Type,  Content, Position) VALUES(?, ?, ?, ?)';
    db.run(sql, [component.page, component.type, component.content, component.position], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update an existing answer
exports.updatePage = (page, user) => {
  return new Promise((resolve, reject) => {
    console.log(page);
    const sql = 'UPDATE pages SET title = ? , author = ? , creationDate = DATE(?) , publishDate = DATE(?) WHERE id = ? and author = ?';
    db.run(sql, [page.title, page.author, page.creationDate, page.publishDate, page.id, user], function (err) {
      if (err) {
        console.log(err)
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
}

// delete an existing page
exports.deletePage = (id, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM pages WHERE id = ? and author = ?';
    db.run(sql, [id, user], function (err) {
      if (err) {
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
}

exports.deleteComponents = (page) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM contentBlock WHERE page = ?';
    db.run(sql, [page], function (err) {
      if (err) {
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
}