import winston from 'winston';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },

    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

// LOGGER PARA DESARROLLO
const devLogger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports:[
            // Muestro en consola los errores tipo debug
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: `./errors-log`,
                level: 'error' //Almacena solo logs desde el nivel error en el archivo.
            })
    ]
})


// LOGGER PARA PRODUCCIÓN
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        // Muestro en consola los errores tipo info
        new winston.transports.Console({
          level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }
        ),
        new winston.transports.File({
            filename: `./errors-log`,
            level: 'error' //Almacena solo logs desde el nivel error en el archivo.
        })
    ]
})

const logger = {
    development: devLogger,
    production: prodLogger
}

export const useLogger = (req, res, next) =>{
    console.log(`${process.env.NODE_ENV}`)
    req.logger = logger[`${process.env.NODE_ENV}`]
    next();
} 