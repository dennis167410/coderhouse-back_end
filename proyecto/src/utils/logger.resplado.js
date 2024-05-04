import winston, { error } from 'winston';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}

// LOGGER PARA DESARROLLO
const devLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({level:"http"}),
        new winston.transports.File({
            filename: `./errors-verbose.logs`,
            level: 'verbose'
        })
    ]
})

// LOGGER PARA PRODUCCIÓN
const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `./errors-warn.logs`,
            level: 'warn' //Almacena solo los logs de tipo warn
        })
    ],
    level: 'http'
})

const logger = {
    development: devLogger,
    production: prodLogger
}

export const useLogger = (req, res, next) =>{
  /*  if(process.env.NODE_ENV === 'production'){
        req.logger = logger.production
    }else{
        req.logger = logger.development
    }
    req.logger = logger;
    req.logger.http(`Metodo: ${req.method}, url: ${req.url} - Hora: ${new Date().toLocaleTimeString()}`
    ); */

    req.logger = logger[`${process.env.NODE_ENV}`]

    next();
} 