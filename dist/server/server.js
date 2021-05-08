"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
// set up dev
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const port = 3000;
io.on('connection', (socket) => {
    socket.on('get-document', (documentId) => {
        if (documentId) {
            console.log('get-document', documentId);
            const data = '';
            socket.join(documentId);
            socket.emit('load-document', data);
            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta);
            });
        }
    });
});
nextApp.prepare().then(() => {
    app.get('*', (req, res) => nextHandler(req, res));
});
server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`socket ready on port ${port}`);
});
