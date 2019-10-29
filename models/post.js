module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    userName: DataTypes.string,
    corntent: DataTypes.STRING,
    header: DataTypes.STRING,
    likes: DataTypes.INT
  });

  Post.associate = function(models) {
    Post.hasMany(models.Comment, {
      onDelete: "cascade"
    });
  };

  return User;
};
