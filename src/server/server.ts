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

const saveDocumentName = async (id, name: string) => {
  // console.log(id, delta);

  await prisma.document.update({ where: { id }, data: { name } });
};

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId: string) => {
    if (documentId) {
      const document = await findOrCreateDocument(documentId);
      // have the socket subscribe to the room set to the document id
      socket.join(documentId);
      socket.emit('load-document', document.delta);

      // handle sending quill document changes
      socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('title-change', async (title) => {
        await saveDocumentName(documentId, title);
        socket.broadcast.to(documentId).emit('title-receive', title);
      });

      socket.on('save', async (data) => {
        if (!documentId) {
          return;
        }
        await saveDocumentDelta(documentId, data);
      });
      socket.on('snapshot', async (snapShot: string) => {
        console.log('saving snapshot');

        await prisma.document.update({
          where: { id: documentId },
          data: { snapShot },
        });
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
