const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', async (req, res) => {
    
});

// router.post('/', async (req, res) => {
   
//     Comment.create({
//         comment_text: req.body.comment_text,
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     })
//     .then(dbCommentData => res.json(dbCommentData))
//     .catch(err => {
//         console.log(err);
//         res.status(400).json(err);
//     });   
// });

//-- posting comments requires an ID and a string value of at least 2 chars.
router.post('/', (req, res) => {
    // check the session
    if (req.session) {
      Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        // use the id from the session
        user_id: req.session.user_id
      })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    }
});
  

router.delete('/:id', (req, res) => {

});




module.exports = router;
