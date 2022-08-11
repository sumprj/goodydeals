const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);

function getSessionMiddleWare(name, path){
    const sessionStore = new MongoDBSessionStore({
        uri: process.env.DB_CONNECT,
        collection: 'mySessions'
    });
    
    sessionStore.on('error', function(error) {
        console.log(error);
    });
    
    const sessionOptions = {
        name:name,
        secret: 'keyboard cat',
        cookie: {path: path, secure: false, maxAge: 1000*60*5 },
        store:sessionStore,
        resave: true,
        saveUninitialized: true,
    };    
    
    return session(sessionOptions);
}

module.exports = getSessionMiddleWare;