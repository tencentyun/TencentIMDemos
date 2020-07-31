'use strict';

const qs = require('qs');
const superagent = require('superagent');
const mysql2 = require('mysql2')
exports.main_handler = async (event, context, callback) => {
    const body = qs.parse(event.body)
    const prod = event.requestContext.stage === 'release'
    const stage = prod ? 'PROD' : 'TEST'
    const config = getDBConfig(stage)
    const promisePool = mysql2.createPool(config).promise();
    //获取微信的session_key
    const wxRes = await superagent.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.appid}&secret=${process.env.appsecrete}&js_code=${body.code}&grant_type=authorization_code`);
    const resData = JSON.parse(wxRes.text)
    
    if (resData.openid) {
        //查询数据库是否注册
        let user = await promisePool.query('select * from user where id = ?', [resData.openid]);
        if (user[0].length) {
            //存在用户
            return user[0][0]
        } else {
            //不存在
            return {
                code: -2,
                seesionKey: resData.session_key,
                msg: 'user not exsit'
            }
        }
    } else {
        return resData
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