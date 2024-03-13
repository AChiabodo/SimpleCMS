import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Retrieves posts from a database
export const getPosts = (req, res) => {
  // If the query string includes a category parameter,
  // select all posts from the given category. Otherwise,
  // select all posts.
  let values = [];
  let q = "SELECT * FROM posts WHERE draft = 0";
  if (req.query.cat) {
    q = "SELECT * FROM posts WHERE draft = 0 AND `cat` = ?";
    values = [req.query.cat];
  }
  else if (req.query.platform) {
    q = "SELECT p.id, `title`, `desc`, `text`, `cat`,`date`,`img` FROM posts p JOIN post_platforms pp ON p.id = pp.post_id JOIN categories cat ON cat.id = p.cat WHERE pp.platform_id = ? AND p.draft = 0 AND cat.type = 'review'";
    values = [req.query.platform];
  }
  q += " ORDER BY `date` DESC";
  if (req.query.limit && !isNaN(req.query.limit) && parseInt(req.query.limit) > 0){
    if (req.query.page && !isNaN(req.query.page) && parseInt(req.query.page) > 0){
      q += " LIMIT ? OFFSET ?";
      values.push(parseInt(req.query.limit));
      values.push((parseInt(req.query.page) - 1) * parseInt(req.query.limit));
    }
    else{
      q += " LIMIT ?";
      values.push(parseInt(req.query.limit));  
    }
  }
  // Use the database object to query the database with the
  // appropriate SQL statement and any necessary parameters.
  db.query(q,values, (err, data) => {
    console.log(q);
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};

// Retrieves a single post from the database
export const getPost = (req, res) => {
  // Select specific fields from both the users and posts table,
  // and join them based on the user ID of the post author.
  const q =
     "SELECT p.id, `username`, `title`, `desc`, `text`, p.img, u.img AS userImg, `cat`,`date`,`draft`, GROUP_CONCAT(pl.console) as platforms, GROUP_CONCAT(pl.id) as platforms_id FROM users u JOIN posts p ON u.id = p.uid LEFT JOIN post_platforms pp ON p.id = pp.post_id LEFT JOIN platforms pl ON pp.platform_id = pl.id WHERE p.id = ? GROUP BY p.id";
 
  // Use the database object to query the database for the post with
  // the given ID, and any necessary parameters.
  db.query(q, [req.params.id], (err, data) => {
     // If there's an error, send a 500 status code and the error message
     if (err) return res.status(500).json(err);
 
     // Otherwise, send a 200 status code and the first item in the data array as JSON
     // Convert the platforms string into an array
     if (data[0] && data[0].platforms) {
       data[0].platforms = data[0].platforms.split(',');
        data[0].platforms_id = data[0].platforms_id.split(',');
     }
     else if(data[0]){
        data[0].platforms = [];
        data[0].platforms_id = [];
     }
     return res.status(200).json(data[0]);
  });
 };

// Adds a new post to the database
export const addPost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid!");
    if (userInfo.role !== "admin") return res.status(403).json("You are not allowed to create a post");
    // Otherwise, construct the SQL query to insert a new post into the database
    const q ="INSERT INTO posts(`title`, `desc`, `text`, `img`, `cat`, `date`,`uid`,`draft`) VALUES (?)";
    console.log(req.body.text);
    // Define an array of values to be inserted into the database, including the
    // post data from the request body and the user ID from the decoded token
    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
      req.body.draft,
    ];

    // Use the database object to execute the SQL query with the values array
    db.query(q, [values], (err, data) => {
      // If there's an error, return a 500 status code and the error message
      if (err) return res.status(500).json(err);
      try {
        addPlatforms(data.insertId, req.body.platforms);
      }
      catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      // Otherwise, return a 200 status code and a success message
      return res.json("Post has been created.");
    });
  });
};

// Deletes a post from the database
export const deletePost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");
  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid");
    if (userInfo.role !== "admin") return res.status(403).json("You are not allowed to delete a post");

    // Otherwise, get the ID of the post to be deleted from the request parameters
    const postId = req.params.id;

    // Construct an SQL query to delete the post with the specified ID, but only if
    // the user ID associated with the post matches the ID of the authenticated user
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    // Execute the SQL query with the postId and userInfo.id as parameters
    db.query(q, [postId, userInfo.id], (err, data) => {
      // If there's an error, return a 403 status code and an error message
      if (err) return res.status(403).json("You can delete only your post");
      try {
        deletePlatforms(postId);
      }
      catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
      
      // Otherwise, return a 200 status code and a success message
      return res.json("Post has been deleted");
    });
  });
};

// Update a post
export const updatePost = (req, res) => {
  // Get the access token from the request cookies.
  const token = req.cookies.access_token;
  // Check if the token exists, if not, return an error response.
  if (!token) return res.status(401).json("Not authenticated!");
  // Verify the token using the "jwtkey" secret key. If the token is not valid, return an error response.
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    if (userInfo.role !== "admin") return res.status(403).json("You are not allowed to update a post");

    // Get the post ID from the request parameters.
    const postId = req.params.id;

    // SQL query to update the post with new values.
    let q = "UPDATE posts SET" 
    const values = [];
    if (req.body.title){
      q += " `title` = ?"
      values.push(req.body.title)
    }
    if (req.body.desc){
      q += ", `desc` = ?"
      values.push(req.body.desc)
    }
    if (req.body.img){
      q += ", `img` = ?"
      values.push(req.body.img)
    }
    if (req.body.cat){
      q += ", `cat` = ?"
      values.push(req.body.cat)
    }
    if (req.body.text){
      q += ", `text` = ?"
      values.push(req.body.text)
    }
    if (req.body.draft !== undefined){
      q += ", `draft` = ?"
      values.push(req.body.draft)
    }
    q += " WHERE `id` = ? AND `uid` = ?";
    console.log(q);
    // Execute the query using the values and post ID. If there's an error, return an error response. Otherwise, return a success response.
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      try {
        updatePlatforms(postId, req.body.platforms);
      }
      catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
      return res.json("Post has been updated.");
    });
  });
};

export const getDraftedPosts = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    console.log(JSON.stringify(userInfo) + " " + req.params.uid);
     if (err) return res.status(403).json("Token is not valid");
     if (userInfo.role !== "admin") return res.status(403).json("You are not allowed to see drafts");
     if (userInfo.id != req.params.uid) return res.status(403).json("You are not allowed to see drafts");
     const q = `
       SELECT p.*, c.category, GROUP_CONCAT(pl.console) as platforms, GROUP_CONCAT(pl.id) as platforms_id , draft
       FROM posts p
       LEFT JOIN categories c ON p.cat = c.id
       LEFT JOIN post_platforms pp ON p.id = pp.post_id
       LEFT JOIN platforms pl ON pp.platform_id = pl.id
       WHERE p.uid = ? AND p.draft = 1
       GROUP BY p.id
     `;
     db.query(q, [userInfo.id], (err, data) => {
       if (err) return res.status(500).json(err);
       // Convert the platforms string into an array
       data.forEach(post => {
         if (post.platforms) {
           post.platforms = post.platforms.split(',');
            post.platforms_id = post.platforms_id.split(',');
         } else {
           post.platforms = [];
            post.platforms_id = [];
         }
       });
       return res.status(200).json(data);
     });
  });
 };

const addPlatforms = (idPost, platforms) => {
  const q = "INSERT INTO post_platforms(`post_id`, `platform_id`) VALUES ?";
  const values = platforms.map((platform) => [idPost, platform]);
  console.log("addPlatforms : " + values);
  db.query(q, [values], (err, data) => {
    if (err) return err;
    return data;
  });
}

const updatePlatforms = (idPost, platforms) => {
  const q = "DELETE FROM post_platforms WHERE `post_id` = ?";
  db.query(q, [idPost], (err, data) => {
    if (err) return err;
    return addPlatforms(idPost, platforms);
  });
}

const deletePlatforms = (idPost) => {
  const q = "DELETE FROM post_platforms WHERE `id_post` = ?";
  db.query(q, [idPost], (err, data) => {
    if (err) return err;
  });
}

export const getPostsNumber = (req, res) => {
    // If the query string includes a category parameter,
  // select all posts from the given category. Otherwise,
  // select all posts.
  let values = [];
  let q = "SELECT COUNT(*) as num FROM posts WHERE draft = 0";
  if (req.query.cat) {
    q = "SELECT COUNT(*)  as num FROM posts WHERE draft = 0 AND `cat` = ?";
    values = [req.query.cat];
  }
  else if (req.query.platform) {
    q = "SELECT COUNT(*)  as num FROM posts p JOIN post_platforms pp ON p.id = pp.post_id WHERE pp.platform_id = ? AND p.draft = 0";
    values = [req.query.platform];
  }
  // Use the database object to query the database with the
  // appropriate SQL statement and any necessary parameters.
  db.query(q,values, (err, data) => {
    console.log(q);
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data[0]);
  });
}

export const getDraftsNumber = (req, res) => {
  // If the query string includes a category parameter,
  // select all posts from the given category. Otherwise,
  // select all posts.
  let values = [];
  let q = "SELECT COUNT(*) as num FROM posts WHERE draft = 1";
  if (req.query.cat) {
    q = "SELECT COUNT(*)  as num FROM posts WHERE draft = 1 AND `cat` = ?";
    values = [req.query.cat];
  }
  else if (req.query.platform) {
    q = "SELECT COUNT(*)  as num FROM posts p JOIN post_platforms pp ON p.id = pp.post_id WHERE pp.platform_id = ? AND p.draft = 1";
    values = [req.query.platform];
  }
  // Use the database object to query the database with the
  // appropriate SQL statement and any necessary parameters.
  db.query(q,values, (err, data) => {
    console.log(q);
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data[0]);
  });
}