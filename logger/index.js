const buildProdLogger=require('./prod-logger');
const buildDevlogger=require('./dev-logger');
require('dotenv').config();

let logger=null

if(process.env.NODE_ENV === "development"){
    logger=buildDevlogger();
}
if(process.env.NODE_ENV === "production"){
    logger=buildProdLogger();
}

module.exports=logger;