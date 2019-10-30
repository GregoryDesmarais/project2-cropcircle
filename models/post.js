module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    userName: DataTypes.STRING,
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    corntent: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    header: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  // Section not needed, as we are defining "Comment" has "belongingTo" a post.
  // Post.associate = function(models) {
  //   Post.hasMany(models.Comment, {
  //     onDelete: "cascade"
  //   });
  // };

  return Post;
};
