module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    userName: DataTypes.STRING,
    corntent: DataTypes.STRING
  });
  return Comment;
};
