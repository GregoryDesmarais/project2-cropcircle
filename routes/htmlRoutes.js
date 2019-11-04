/* eslint-disable prettier/prettier */
var db = require("../models");

module.exports = function(app) {
  //Load index page
  app.get("/", function(req, res) {
    res.render("home", {});
  });

  //Get all posts for category
  app.get("/:category", function(req, res) {
    db.Post.findAll({ where: { category: req.params.category.toLowerCase() } }).then(function(
      posts
    ) {
      const filteredPosts = posts.sort((a, b) => a.id < b.id ? 1 : -1);
      res.render("categories", {
        post: filteredPosts,
        category: req.params.category.toLowerCase()
      });
    });
  });

  //Beginnings of grabbing all comments for a post. "Should" grab all comments where PostId = the post parameter number.
  app.get("/:category/:post", function(req, res) {
    db.Post.findOne({ where: { id: req.params.post } }).then(function(post) {
      db.Comment.findAll({
        where: {
          PostId: req.params.post
        }
      }).then(function(comments) {
        res.render("post", {
          title: post,
          category: req.params.category.toLowerCase(),
          post: req.params.post,
          comments: comments
        });
      });
    });
  });

  // *********All additional routes should be placed above this one.*********
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};