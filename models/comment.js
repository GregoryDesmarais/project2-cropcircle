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
      foreignKey: "PostId", //This was added to connect the comment to the PostId.
      onDelete: "cascade"
    });
  };
  return Comment;
};
