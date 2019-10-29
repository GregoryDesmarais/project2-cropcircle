module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    userName: DataTypes.STRING,
    corntent: DataTypes.STRING,
    header: DataTypes.STRING,
    likes: DataTypes.INTEGER
  });

  Post.associate = function(models) {
    Post.hasMany(models.Comment, {
      onDelete: "cascade"
    });
  };

  return Post;
};
