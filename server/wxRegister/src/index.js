'use strict';

const qs = require('qs');
const mysql2 = require('mysql2')

const WXBizDataCrypt = require('./WXBizDataCrypt')
const superagent = require('superagent');
const apiUserSig = require('./userSig')
const getUserSig = function (userId) {
    const sig = new apiUserSig.Api(process.env.sdkAppId, process.env.sdkSecret)
    const userSig = sig.genSig(userId, 60 * 24 * 60 * 60); //有效期60天
    return userSig
}
exports.main_handler = async (event, context, callback) => {


    const body = qs.parse(event.body)
    const prod = event.requestContext.stage === 'release'
    const stage = prod ? 'PROD' : 'TEST'
    const config = getDBConfig(stage)
    const promisePool = mysql2.createPool(config).promise();
    const pc = new WXBizDataCrypt(process.env.appid, body.session_key)
    const data = pc.decryptData(body.encryptedData, body.iv)
    const userSig = getUserSig('administrator')
    const imuser = await superagent.post(`https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=${process.env.sdkAppId}&identifier=administrator&usersig=${userSig}&random=${Math.random()}&contenttype=json`, {
        "Identifier": data.openId,
        "Nick": data.nickName,
        "FaceUrl": data.avatarUrl
    })
    console.log(imuser.text)
    const imUserObj = JSON.parse(imuser.text)
    if(imUserObj.ActionStatus !== 'OK'){
        return {
            code:imUserObj.ErrorCode,
            msg:'添加IM账号体系用户失败'
        }
    }
    // 导入单个用户到IM后台
    // https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=88888888&identifier=admin&usersig=xxx&random=99999999&contenttype=json
    // 写数据库
    await promisePool.query('insert into user (id,nick,gender,addr,avatar,create_time) values (?,?,?,?,?,?)', [
        data.openId,
        data.nickName,
        data.gender,
        data.city,
        data.avatarUrl,
        new Date()
    ])
    const {
        nickName,
        gender,
        avatarUrl
    } = data
    return {
        nick: nickName,
        gender: gender,
        avatar: avatarUrl
    }
};

function getDBConfig(stage) {
  return {
    host: process.env[`DB_${stage}_HOST`],
    user: process.env[`DB_${stage}_USER`],
    port: process.env[`DB_${stage}_PORT`],
    password: process.env[`DB_${stage}_PASSWORD`],
    database: process.env[`DB_${stage}_DATABASE`],
    connectionLimit: 1
  }
}