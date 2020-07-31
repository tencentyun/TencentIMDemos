'use strict';


const apiUserSig = require('./userSig')
//签发usersig
const sdkAppId = process.env.sdkAppId;
const sdkSecret = process.env.sdkSecret;
const getUserSig = function (userId) {
    const sig = new apiUserSig.Api(sdkAppId, sdkSecret)
    const userSig = sig.genSig(userId, 60 * 24 * 60 * 60); //有效期60天
    return userSig
}
exports.main_handler = async (event, context, callback) => {
    return {
        userSig:getUserSig(event.queryString.userId)
    }
};

