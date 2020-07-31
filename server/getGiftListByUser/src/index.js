'use strict';
const mysql2 = require('mysql2')

exports.main_handler = async (event, context, callback) => {
  try {
    const prod = event.requestContext.stage === 'release'
    const stage = prod ? 'PROD' : 'TEST'
    const config = getDBConfig(stage)
    const promisePool = mysql2.createPool(config).promise();
    const body = JSON.parse(event.body);
    const { user_id } = body;
    const [giftList] = await promisePool.query(`
      select 
        send_gift.id, send_gift.from_id,
        gift.name, gift.detail, gift.url, gift.price, gift.thumbnail,
        user.nick, user.avatar 
      from send_gift 
      left join gift on send_gift.gift_id=gift.id 
      left join user on user.id=send_gift.from_id 
      where send_gift.to_id="${user_id}" 
      order by send_gift.create_time desc limit 100
    `);

    return getSuccessResponse('', giftList);
  } catch (e) {
    return getErrorResponse(e.message)
  }
}

function getSuccessResponse(msg = "ok", data) {
  return {
    msg,
    data,
    code: 200
  }
}

function getErrorResponse(msg = "err") {
  return {
    msg,
    code: 0
  }
}

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