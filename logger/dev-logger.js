const {createLogger,format,transports} = require('winston')
const {combine,timestamp,label,printf,errors} = format


const myFormat = printf(({level,message,timestamp,stack})=>{
    return `${timestamp} ${level} :  ${stack || message}`
})
const buildDevLogger = () =>{
    return createLogger({
        // level:'info',
        format: combine(format.colorize(),
        timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        errors ({stack : true}),
        myFormat),
        // defaultMeta:{service:'user-service'},
        transports :[
            new transports.Console(),
        ]

    })

}

module.exports = buildDevLogger