const { addSeconds } = require('date-fns');
const { UserToken } = require('../db/models');

class TokenStoreService {
    static async storeToken (userId, serviceName, accessToken, refreshToken, expiresIn) {
        refreshToken = refreshToken || null;
        const expireTime = expiresIn ? addSeconds(new Date(), expiresIn) : null;

        const userToken = await UserToken.create({
            userId,
            serviceName,
            accessToken,
            refreshToken,
            expireTime
        });

        return userToken;
    }

    static async getToken (userId, serviceName) {

    }
}

module.exports = TokenStoreService;