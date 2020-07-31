'use strict';
const mysql2 = require('mysql2')

exports.main_handler = async (event, context, callback) => {
  try {
    const prod = event.requestContext.stage === 'release'
    const stage = prod ? 'PROD' : 'TEST'
    const config = getDBConfig(stage)
    const promisePool = mysql2.createPool(config).promise();
    const body = JSON.parse(event.body);
    const { user_id, id } = body;
    const [[[user]], [[gift]], [[like]], [[follow]], [is_followed]] = await Promise.all([
        promisePool.query(`select * from user where id="${user_id}"`),
        promisePool.query(`select count(*) count from send_gift where to_id="${user_id}"`),
        promisePool.query(`select count(*) count from \`like\` where to_id="${user_id}"`),
        promisePool.query(`select count(*) count from follow where to_id="${user_id}"`),
        promisePool.query(`select id from follow where to_id="${user_id}" and from_id="${id}"`)
    ])
    
    return getSuccessResponse('', {
      userinfo: user,
      gift,
      like,
      follow,
      is_followed: is_followed.length ? true : false
    });
  } catch (e) {
    return getErrorResponse(e.message)
  }
}

async function checkIfExist(id, table, pool) {
  return pool.query(`select * from ${table} where id="${id}"`).then(res => {
    return res[0].length ? true : Promise.reject(new Error('对象不存在'));
  })
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

