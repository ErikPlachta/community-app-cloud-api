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

const router = require('express').Router();

// router.get('/', (req, res) => {
//     //The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template.
//     res.render('homepage'); // 
// });

router.get('/', (req, res) => {
    res.render('homepage', {
      id: 1,
      post_url: 'https://handlebarsjs.com/guide/',
      title: 'Handlebars Docs',
      created_at: new Date(),
      vote_count: 10,
      comments: [{}, {}],
      user: {
        username: 'test_user'
      }
    });
  });
  

module.exports = router;
