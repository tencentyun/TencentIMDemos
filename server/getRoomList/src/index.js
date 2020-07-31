'use strict'; 
const mysql2 = require('mysql2')
exports.main_handler = async (event, context, callback) => {
    const prod = event.requestContext.stage === 'release'
    const stage = prod ? 'PROD' : 'TEST'
    const config = getDBConfig(stage)
    const promisePool = mysql2.createPool(config).promise();
    const room = await promisePool.query('select * from room');
    return room[0]
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