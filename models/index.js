//------------------------------------------------------------------------------
//-- IMPORTS
const User = require('./User');
const Post = require("./Post");


//------------------------------------------------------------------------------

//-- Create associations between User and Post column values user_id
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

Post.belongsTo(User, {
    foreignKey: 'user_id',
});




//------------------------------------------------------------------------------
//-- EXPORTS
module.exports = { User, Post };
