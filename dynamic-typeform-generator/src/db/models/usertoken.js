'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    userId: DataTypes.STRING,
    serviceName: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    expireTime: DataTypes.DATE
  }, {});
  UserToken.associate = function(models) {
    // associations can be defined here
  };
  return UserToken;
};