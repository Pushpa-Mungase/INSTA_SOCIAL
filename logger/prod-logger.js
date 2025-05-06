const {createLogger,format,transports} = require('winston')
const {combine,timestamp,printf, errors,json} = format
const { MongoDB } = require('winston-mongodb');
const dotenv = require('dotenv');
require('winston-mongodb');
dotenv.config();

const myFormat = printf(({level,message,timestamp,stack})=>{
    return ` ${level} : ${timestamp}  : ${stack || message}`
}); 
const buildProdLogger = () =>{
    return createLogger({
        format: combine(
            timestamp(),
        errors ({stack : true}),
        myFormat),
        defaultMeta:{service:'user-service'},
        transports :[
            new transports.Console({
                level: 'info'  
            }),
            new MongoDB({
                level:'info',
                db: process.env.MONGO_URI,
                options: {useUnifiedTopology:true},
                collection : 'API-Logs',
                metaKey: 'metaData',
                format : format.combine(format.timestamp(),format.json())
            }),
        ]

    })

}

module.exports = buildProdLogger