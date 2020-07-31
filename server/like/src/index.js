'use strict'; 
const database = require('scf-nodejs-serverlessdb-sdk').database

exports.main_handler = async (event, context, callback) => {
    try {
        const prod = event.requestContext.stage === 'release'
        const stage = prod ? 'PROD' : 'TEST'
        const promisePool = await database(stage).pool()
        const body = JSON.parse(event.body);
        const { from_id, to_id } = body;
        await promisePool.queryAsync(`insert into \`like\` set from_id="${from_id}", to_id="${to_id}"`);
        
        return getSuccessResponse('插入数据成功');
    } catch(e) {
        return getErrorResponse(e.message)
    }
}

function getSuccessResponse(msg = "err", data) {
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