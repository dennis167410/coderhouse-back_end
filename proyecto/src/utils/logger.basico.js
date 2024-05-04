import winston from 'winston';

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({level:"http"}),
        new winston.transports.File({
            filename: `./errors-warn.logs`,
            level: 'warn'
        })
    ]
})

export const addLogger = (req, res, next) =>{
    req.logger = logger;
    req.logger.http(`Metodo: ${req.method}, url: ${req.url} - Hora: ${new Date().toLocaleTimeString()}`
    );
    next();
} 