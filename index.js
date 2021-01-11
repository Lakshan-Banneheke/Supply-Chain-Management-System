const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const pgConnect = require('connect-pg-simple');
// const { defaultLogger } = require('./config/logger');

// Make all variables from our .env file available in our process
require('dotenv').config();

// Init express
const index = express();

// set view engine
index.set('view engine', 'ejs');

// setup middleware and configs
index.use(bodyParser.urlencoded({ extended: true }));
index.use(bodyParser.json());
index.use(cookieParser());
index.use(helmet());

// setup static files
index.use(express.static('./public'));

// session set up
// index.use(session({
//     store: new (pgConnect(session))({ conString: process.env.DATABASE_URL }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
// }));
// setup routes
index.use(require('./routes'));

// uncomment on deployment
// const errorLogger = defaultLogger('error-handler');

// index.use((err, req, res, next) => {
//     const { query, params, body } = req;
//     errorLogger.error({ err, req: { query, params, body } });
//     res.sendStatus(500);
// });

/* Listen on the port for requests */
index.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port %d in %s mode', process.env.PORT, index.settings.env);
});

module.exports = index;
