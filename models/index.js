const User = require("./Users");
const Post = require("./Posts");
const Comment = require("./comment");

User.hasMany(Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "food_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "food_id",
});

module.exports = { User, Post, Comment };
