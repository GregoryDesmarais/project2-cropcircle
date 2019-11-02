/* eslint-disable prettier/prettier */
var db = require("../models");
const jwt = require("jsonwebtoken");

module.exports = function(app) {
  // Get all categories
  app.get("/api/:category", function(req, res) {
    db.Post.findAll({ where: { category: req.params.category }}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  //Create a new user
  app.post("/api/newUser", (req, res) => {
    console.log(req.body);
    db.User.findAll({
      where: {
        userName: req.body.name
      }
    }).then(data => {
      if (data.length > 0) {
        res.json({ newUser: false });
      } else {
        db.User.create({
          userName: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        res.json({ newUser: true });
      }
    });
  });

  // Create a new example
  app.post("/api/posts", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          message: "Post created...",
          authData
        });
      }
    });
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/api/login", (req, res) => {
    console.log(req.body);
    // const user = {
    //   id: 1,
    //   username: "charles",
    //   email: "charles@gmail.com"
    // };
    db.User.findOne({
      where: {
        userName: req.body.userName,
        password: req.body.password
      }
    }).then(data => {
      console.log(data.dataValues);
      user = {
        id: data.id,
        userName: data.dataValues.userName,
        email: data.dataValues.email,
        createdAt: data.dataValues.createdAt
      };
      jwt.sign({ user }, "secretkey", (err, token) => {
        if (err) {
          throw err;
        } else {
          const data = [user, token];
          res.json({ data });
        }
      });
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  }
};
