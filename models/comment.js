module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    userName: DataTypes.string,
    corntent: DataTypes.STRING
  });
  return Comment;
};
