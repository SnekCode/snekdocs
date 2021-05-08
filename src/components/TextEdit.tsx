import Quill from 'quill';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const TOOLBAR_OPTIONS = [
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

const TextEdit: React.FC<{ documentId: string }> = ({ documentId }) => {
  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap>
  >();
  const [quill, setQuill] = useState<Quill>();

  // initialize socket connection
  useEffect(() => {
    const s = io();
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // save per SAVE_INIT_MS
  useMemo(() => {
    if (!socket || !quill) {
      return;
    }
    const interval = setInterval(() => {
      socket.emit('save', quill.getContents());
    }, SAVE_INIT_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // send delta when changes are made
  useEffect(() => {
    if (socket && quill) {
      const handler = (delta, oldDelta, source) => {
        if (source !== 'user') {
          return;
        }
        socket.emit('send-changes', delta);
      };

      quill.on('text-change', handler);

      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [socket, quill]);

  // get delta from others
  useEffect(() => {
    if (socket && quill) {
      const handler = (delta) => {
        console.log('update');

        quill.updateContents(delta);
      };

      socket.on('receive-changes', handler);

      return () => {
        socket.off('receive-changes', handler);
      };
    }
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) {
      return;
    }
    // quill.setContents(document);
    socket.once('load-document', (data) => {
      console.log('loading data', data);
      if (data) {
        quill.setContents(JSON.parse(data));
      }
      quill.enable();
    });

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = '';
    const Quill = require('quill');
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('');
    setQuill(q);
  }, []);

  return <div ref={wrapperRef} className="editor"></div>;
};

export default TextEdit;
