import { MutableRefObject, useRef, useEffect } from 'react';
import { useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { ICustomQuill } from '../components/Editor/Toolbar';
import setQuillOptions from './setQuillOptions';
import { debounce } from '@material-ui/core';
import domtoimage from 'dom-to-image';

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
  const [quill, setQuill] = useState<ICustomQuill>();

  const quillRef = useRef(null) as MutableRefObject<HTMLDivElement>;

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }

    setQuillOptions();

    wrapper.innerHTML = '';
    const Q = require('quill');
    // Set up custom Font sizes

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
    }) as ICustomQuill;
    q.disable();
    setQuill(q);
    return wrapper;
  }, []);

  // initialize socket connection
  useEffect(() => {
    // set socket to variable and add to use state
    const s = io();
    setSocket(s);
    // disconnect socket on un mount
    return () => {
      s.disconnect();
    };
  }, []);

  // send delta when changes are made
  // save document on unmount
  useEffect(() => {
    if (socket && quill) {
      // define the quill on change handler here. due to using socket io we need socket in scope.
      // socket io will send the delta (change) to the send-changes event.
      const handler = (delta, oldDelta, source) => {
        if (source !== 'user') {
          return;
        }
        socket.emit('send-changes', delta);
      };

      const save = (delta, oldDelta, source) => {
        domtoimage
          .toPng(document.getElementById('canvas'))
          .then(function (dataUrl) {
            console.log('sending snapshot');
            socket.emit('snapshot', dataUrl);
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });

        if (source !== 'user') {
          return;
        }
        socket.emit('save', quill.getContents());
      };
      if (process.browser) {
        // set up the listener to handle text change
        quill.on('text-change', handler);
        quill.on('text-change', debounce(save, 600));
      }

      // removes the listener on component un mount
      return () => {
        // try to get image of document

        // save before killing quill
        socket.emit('save', quill.getContents());
        quill.off('text-change', handler);
      };
    }
  }, [socket, quill]);

  // saves on window close
  if (process.browser) {
    window.onbeforeunload = (e) => {
      e.preventDefault();
      socket.emit('save', quill.getContents());
    };
  }

  // get delta from others
  useEffect(() => {
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
