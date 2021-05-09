import Quill from 'quill';
import { MutableRefObject, useRef } from 'react';
import { useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const TOOLBAR_OPTIONS = [
  [],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const SAVE_INIT_MS = 2000;

const useQuillDocumentSocket = (documentId: string) => {
  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap>
  >();
  const [quill, setQuill] = useState<Quill>();

  const quillRef = useRef(null) as MutableRefObject<HTMLDivElement>;

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = '';
    const Q = require('quill');
    // Set up custom Font sizes
    const Size = Q.import('attributors/style/size');
    Q.register(Size, true);
    Size.whitelist = ['10px', '13px', '18px', '32px', '48px'];

    // Add fonts to whitelist
    const Font = Q.import('formats/font');
    // We do not add Sans Serif since it is the default
    Font.whitelist = ['inconsolata', 'roboto', 'mirza'];
    Q.register(Font, true);

    const editor = document.createElement('div');
    // add element to quillRef
    quillRef.current = editor;
    wrapper.append(editor);
    const q = new Q(editor, {
      theme: 'snow',
      modules: {
        toolbar: '#toolbar-container',
        history: {
          delay: 1000,
          maxStack: 500,
          userOnly: true,
        },
      },
    }) as Quill;
    q.disable();
    setQuill(q);
  }, []);

  // initialize socket connection
  useMemo(() => {
    // set socket to variable and add to use state
    const s = io();
    setSocket(s);
    // disconnect socket on un mount
    return () => {
      s.disconnect();
    };
  }, []);

  // save per SAVE_INIT_MS
  useMemo(() => {
    if (!socket || !quill) {
      return;
    }
    // send save though socket
    // Not sure we need this here...
    // could save via react query
    const interval = setInterval(() => {
      socket.emit('save', quill.getContents());
    }, SAVE_INIT_MS);

    // clears the auto save interval on un mount
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // send delta when changes are made
  useMemo(() => {
    if (socket && quill) {
      // define the quill on change handler here. due to using socket io we need socket in scope.
      // socket io will send the delta (change) to the send-changes event.
      const handler = (delta, oldDelta, source) => {
        if (source !== 'user') {
          return;
        }
        socket.emit('send-changes', delta);
      };

      // set up the listener to handle text change
      quill.on('text-change', handler);

      // removes the listener on component un mount
      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [socket, quill]);

  // get delta from others
  useMemo(() => {
    if (socket && quill) {
      // set up the socket receive changes handler to write changes to quill
      const handler = (delta) => {
        quill.updateContents(delta);
      };

      // listens for changes emitted from the server
      socket.on('receive-changes', handler);

      return () => {
        socket.off('receive-changes', handler);
      };
    }
  }, [socket, quill]);

  useMemo(() => {
    if (!socket || !quill) {
      return;
    }
    // quill.setContents(document);
    socket.once('load-document', (data) => {
      console.log('loading data', data);
      if (data) {
        quill.setContents(data);
      }
      quill.enable();
      quill.focus();
    });

    // request document by id
    // new document is created if the documentId does not exist
    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  return { wrapperRef, quillRef, socket, quill };
};

export default useQuillDocumentSocket;
