module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    userName: DataTypes.STRING,
    corntent: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  //Comment "belongsTo" a single post.
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      onDelete: "cascade"
    });
  };
  return Comment;
};
