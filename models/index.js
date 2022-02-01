//------------------------------------------------------------------------------
//-- IMPORTS
const User = require('./User');
const Post = require("./Post");
const Vote = require('./Vote');

//------------------------------------------------------------------------------

//-- Create associations between User and Post column values user_id
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

Post.belongsTo(User, {
    foreignKey: 'user_id',
});


//-- Associates both users and post to vote, our through table

/*
  Now we need to associate User and Post to one another in a way that when we
  query Post, we can see a total of how many votes a user creates; and when we
  query a User, we can see all of the posts they've voted on. You might think
  that we can use .hasMany() on both models, but instead we need to use
  .belongsToMany().
*/

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

/*
  By also creating one-to-many associations directly between these models,
  we can perform aggregated SQL functions between models. In this case,
  we'll see a total count of votes for a single post when queried. This
  would be difficult if we hadn't directly associated the Vote model with
  the other two.
*/

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});




//------------------------------------------------------------------------------
//-- EXPORTS
module.exports = { User, Post, Vote };
