const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, simple } = format;


module.exports = () => { 

  return createLogger({
    format: combine(      
      timestamp(),
      simple()
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'log/error.log',
        level: 'error',
      }),
      new transports.File({
        filename: 'log/server.log',
      })]
  });
};