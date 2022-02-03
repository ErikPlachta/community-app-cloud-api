const router = require('express').Router();

//-- including ALL that have shared relationships, to ensure access to shared res.
const { User, Post, Vote, Comment } = require("../../models");

// GET /api/users
// router.get('/', (req, res) => {});
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });      
  });

// GET /api/users/1
// router.get('/:id', (req, res) => {});
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      // include the Comment model here:
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });      
});

// POST /api/users
// router.post('/', (req, res) => {});
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    
    /* IN SQL WOuld look like this: 
  
        INSERT INTO users
        (username, email, password)
        VALUES
        ("Lernantino", "lernantino@gmail.com", "password1234");

    */
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      //-- Accessing user data from db
      // .then(dbUserData => res.json(dbUserData))
      //-- accessing the session information and user data from db
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
      
          res.json(dbUserData);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

// POST /api/users/login
/* Here's what we're doing in the Following code:
    
    1. We queried the User table using the findOne() method for the email
    entered by the user and assigned it to req.body.email.

    2. If the user with that email was not found, a message is sent back as a
    response to the client.

    3. However, if the email was found in the database, the next step will be
    to verify the user's identity by matching the password from the user and the
    hashed password in the database. This will be done in the Promise of the
    query.
*/
router.post('/login', (req, res) => {

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    
    //-- try to find email in database
    User.findOne({
        where: {
        email: req.body.email
        }
    })
    //-- then user verification client management
    .then(dbUserData => {
      if (!dbUserData) {
          res.status(400).json({ message: 'No user with that email address!' });
          return;
      }
      // Otherwise, verify password matches user database

      // -- send back user payload with hash'd pass in db ( testing )
      // res.json({ user: dbUserData });

      //-- verify password
      /* confirm if provided password matches, by taking EU input, hashing,
          matching to db, and then returning boolean.
      */
      
      //-- is password a match to user?
      const validPassword = dbUserData.checkPassword(req.body.password);
      
      //-- if not, exit
      if (!validPassword) {
          res.status(400).json({ message: 'Incorrect password!' });
          return;
      }

      /* 
        This code sets up an Express.js session and connects the session to our
          Sequelize database.
      */
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        //-- otherwise, confirm logged in and return paylod for awareness too.
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });
});

//-- Logging out - (destroying the session variables and resetting the cookie.)
router.post('/logout', (req, res) => {
  
  if (req.session.loggedIn) {
    
    //-- destroy session variables
    req.session.destroy(() => {
      //-- once logged out, let client know request was successful
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});


  

// PUT /api/users/1
// router.put('/:id', (req, res) => {});
router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
  /* in SQL would look like this

      UPDATE users
      SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
      WHERE id = 1;

  */

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
  

// DELETE /api/users/1
// router.delete('/:id', (req, res) => {});
router.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

module.exports = router;

