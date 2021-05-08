const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
import { Document } from '.prisma/client';
import prisma from '../prisma/prisma';

// set up dev
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const port = 3000;

const findOrCreateDocument = async (id): Promise<Document> => {
  if (id) {
    // check for id in data base
    let document = await prisma.document.findUnique({ where: { id } });
    if (document) {
      return document;
    }
    document = await prisma.document.create({
      data: {
        delta: '',
        id,
      },
    });

    return await document;
  }
};

const saveDocumentDelta = async (id, delta: string) => {
  // console.log(id, delta);

  await prisma.document.update({ where: { id }, data: { delta } });
};

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId: string) => {
    if (documentId) {
      const document = await findOrCreateDocument(documentId);
      // console.log('get-document', document);
      socket.join(documentId);
      socket.emit('load-document', document.delta);

      socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save', async (data) => {
        if (!documentId) {
          return;
        }
        await saveDocumentDelta(documentId, JSON.stringify(data));
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
