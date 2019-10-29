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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
