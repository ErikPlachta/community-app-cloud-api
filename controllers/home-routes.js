// This file will contain all of the user-facing routes, such as the homepage and login page.

/*
    Previously, we used res.send() or res.sendFile() for the response. Because
    we've hooked up a template engine, we can now use res.render() and specify
    which template we want to use. In this case, we want to render the
    homepage.handlebars template (the .handlebars extension is implied). This
    template was light on content; it only included a single <div>. Handlebars.js
    will automatically feed that into the main.handlebars template, however, and
    respond with a complete HTML file.


*/
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

//-- Express route mgmt
const router = require('express').Router();

// router.get('/', (req, res) => {
//     //The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template.
//     res.render('homepage'); // 
// });

//-- Basic homepage route as proof of concept
// router.get('/', (req, res) => {
//     res.render('homepage', {
//       id: 1,
//       post_url: 'https://handlebarsjs.com/guide/',
//       title: 'Handlebars Docs',
//       created_at: new Date(),
//       vote_count: 10,
//       comments: [{}, {}],
//       user: {
//         username: 'test_user'
//       }
//     });
//   });

//-- More complex routing to homepage
router.get('/', (req, res) => {

    Post.findAll({
        attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
            model: User,
            attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
    .then(dbPostData => {
        //-- testing to verify payload
        // console.log(dbPostData[0]);
        // pass a single post object into the homepage template
        //-- basic render ( doesn't pull properly, but leaving for notes)
        // res.render('homepage', dbPostData[0]);
        // -- more complex render, showing how to extrac the data
        // res.render('homepage', dbPostData[0].get({ plain: true }));

        //-- extracint data from Sequelize response, and preparing to add to page
        const posts = dbPostData.map(post => post.get({ plain: true }));
        //-- updating page with content from post
            /*NOTE: homepage.handlebars has a dynamic loop built in to render all*/
        res.render('homepage', 
          { 
            //-- send posts
            posts,
            //-- send if logged in or not status
            loggedIn: req.session.loggedIn
          }
        );
        console.log(req.session);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//-- Request a Specific Post by ID- ( hard coded to simplify testing and limit points of failure )
// router.get('/post/:id', (req, res) => {
//     const post = {
//       id: 1,
//       post_url: 'https://handlebarsjs.com/guide/',
//       title: 'Handlebars Docs',
//       created_at: new Date(),
//       vote_count: 10,
//       comments: [{}, {}],
//       user: {
//         username: 'test_user'
//       }
//     };
  
//     res.render('single-post', { post });
//   });

//-- Request a Specific Post by ID
router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template built by handlebars
        res.render('single-post', 
          {
            post,
            loggedIn: req.session.loggedIn
          }
        );
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  

//-- check for a session and redirect to the homepage 
router.get('/login', (req, res) => {
    //-- IE if cookies show active session, don't require login again already logged in.
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    

    res.render('login');
});

module.exports = router;
