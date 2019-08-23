const app = require('express')();

const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const router = require('./routes');
const cors = require('cors');
/**
 * Socket Connection
 */
const sockets = require('./chat');
sockets.socketServer(http);

app.use(cors());

app.use(bodyParser.json());

app.use('/', router);

http.listen(3000, () => console.log('app started'));