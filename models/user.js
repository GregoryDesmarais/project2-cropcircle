module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = function(models) {
    User.hasMany(models.Post, { onDelete: "cascade" });
    User.hasMany(models.Comment, {
      onDelete: "cascade"
    });
  };

  return User;
};
