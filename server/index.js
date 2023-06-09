'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use('/public', express.static('public'));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

const debugCorsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  //  console.log(req.isAuthenticated())
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'wge8d239bwd93rkskb',   //personalize this random string, should be a secret value
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Front-Office APIs ***/

//GET /api/pages
app.get('/api/front/pages', (req, res) => {
  dao.listPagesPublished()
    .then(pages => res.json(pages))
    .catch(() => res.status(500).end());
});

// GET /api/pages/<id>
app.get('/api/front/pages/:id', async (req, res) => {
  try {
    const result = await dao.getPage(req.params.id,true);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/pages/<id>
app.get('/api/front/content/:idPage', async (req, res) => {
  try {
    const result = await dao.getContent(req.params.idPage);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

/*** Back-Office APIs ***/
app.get('/api/pages', isLoggedIn, (req, res) => {
  //console.log("User : " + req.user.id);
  dao.listPages(req.params.id)
    .then(pages => res.json(pages))
    .catch(() => res.status(500).end());
});

// GET /api/pages/<id>
app.get('/api/pages/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getFilm(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/users
app.get('/api/users', isLoggedIn, async (req, res) => {
  try {
    const users = await dao.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/users/<id>
app.get('/api/users/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await userDao.getUser(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/pages/<id>
app.get('/api/content/:idPage',isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getContent(req.params.idPage,req.user.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// Create a new page
// POST /api/pages
app.post('/api/pages', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('creationDate').isDate({ format: 'YYYY-MM-DD' }),
  check('user').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  const user = req.body.user;
  const e = req.body;
  const resultUser = await userDao.getUser(user);  // needed to ensure db consistency
  if (resultUser.error)
    res.status(404).json(resultUser);   // questionId does not exist, please insert the question before the answer
  else {
    const page = { id: e.id, title: e.title, author: e.author, creationDate: e.creationDate, publishDate: (publishDate ? e.publishDate : null), user: e.user };
    try {
      const pageId = await dao.createFilm(page);
      // Return the newly created id of the question to the caller. 
      // A more complex object can also be returned (e.g., the original one with the newly created id)
      res.status(201).json(pageId);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of answer ${page.title} by user : ${page.user}.` });
    }
  }
});

//Update the page
//PUT /api/pages/<id>
app.put('/api/pages/:id', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('id').isInt(),
  check('user').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const page = req.body;
  // you can also check here if the id passed in the URL matches with the id in req.body,
  // and decide which one must prevail, or return an error
  if (parseInt(page.id) != parseInt(req.params.id)) {
    res.status(422).json({ error: `Database error during the update of film ${req.params.id} : invalid ID.` });
    return;
  };

  try {
    const numRowChanges = await dao.updateFilm(page, req.user.id);
    res.json(numRowChanges);
    //res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of film ${req.params.id}.` });
  }
});

// DELETE /api/pages/<id>
app.delete('/api/pages/:id', async (req, res) => {
  try {
    const numRowChanges = await dao.deleteFilm(req.params.id, req.user.id);
    // number of changed rows is sent to client as an indicator of success
    res.json(numRowChanges);
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}.` });
  }
});

/*** Users APIs ***/
// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// Activate the server
app.listen(port, () => {
  console.log(`react-cms-server listening at http://localhost:${port}`);
});