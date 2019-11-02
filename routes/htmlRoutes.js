/* eslint-disable prettier/prettier */
var db = require("../models");

module.exports = function(app) {
  //Load index page
  app.get("/", function(req, res) {
    res.render("home", {});
  });

  // Load example page and pass in an example by id
  app.get("/example/:category", function(req, res) {
    db.Post.findOne({ where: { id: req.params.category } }).then(function(
      category
    ) {
      res.render("post", {
        example: category
      });
    });
  });

  // Data test section.
  // Create simple user.
  app.get("/gregTest/:post", function(req) {
    db.User.create({
      userName: "Greg",
      email: "Greg@greg.com",
      password: "access"
    });
    // Create Test Post
    db.Post.create({
      userName: "Greg",
      category: "coding",
      header: "Test Post 1",
      corntent: "This is a test post",
      UserId: "1" //This is where the userName is passed from the webpage.
    });
    //Create Test Comment
    db.Comment.create({
      userName: "Greg",
      corntent: "This is a test reply",
      PostId: req.params.post, //Assuming that for each post "page", we will have a "reply"
      UserId: "1" //This is where the userName is passed from the webpage.
    });
  });

  //Get all posts for category
  app.get("/:category", function(req, res) {
    db.Post.findAll({ where: { category: req.params.category } }).then(function(
      posts
    ) {
      const filteredPosts = posts.sort((a, b) => a.id < b.id ? 1 : -1);
      res.render("categories", {
        post: filteredPosts, 
        category: req.params.category
      });
    });
  });

  //Beginnings of grabbing all comments for a post. "Should" grab all comments where PostId = the post parameter number.
  app.get("/:category/:post", function(req, res) {
    db.Post.findAll({ where: { id: req.params.post } }).then(function(post) {
      db.Comment.findAll({
        where: {
          PostId: req.params.post
        }
      }).then(function(comments) {
        res.render("post", {
          category: req.params.category,
          post: post,
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
