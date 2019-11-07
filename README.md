# project2 - [CropCircle](https://project2-project-boogaloo.herokuapp.com/)

## Introduction
CropCircle is a small group collaboration done as a group assignment for the coding bootcamp. It is a means of learning new material, practicing old material and showing off to potential employers the skills and abilities of the group members. CropCircle is a fully functioning forum that allows clients to create a unique username and join loose discussions covering different topics.

## Members
- Gregory Desmarais
- Bradley Cordle
- Charles Danner
- Dylan Trimble

## Technologies Used
- node.js
- mysql2 npm
- sequelize npm
- jwt (JSON Web Token) npm
- express npm
- express-handlebars npm
- bcrypt npm
- BootStrap
- JQuery

## How it works!
Users can access different "categories" via the dropdown menu.  Or, if they have created a personal forum, they can manually navigate to it via the category name in the URL.  Example: [https://project2-project-boogaloo.herokuapp.com/coding](https://project2-project-boogaloo.herokuapp.com/coding).

The server will then query the database to return all posts for that category.  