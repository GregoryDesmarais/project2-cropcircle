module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    favorites: {
      type: DataTypes.STRING,
      defaultValue: "movies,television,sports,technology,cars,cats"
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Post, { onDelete: "cascade" });
    User.hasMany(models.Comment, {
      onDelete: "cascade"
    });
  };

  return User;
};
