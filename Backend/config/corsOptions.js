const allowedOrigins = require('./allowedOrigins')

// Necessary CORS options for client web applications that are loaded in one domain to interact with different domain.
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    allowedHeaders: [
        "set-cookie",
        "Content-Type",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
      ],
    optionsSuccessStatus: 200
}

module.exports = corsOptions 