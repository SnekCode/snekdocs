import { Document } from '.prisma/client';
import Quill from 'quill';
import Delta from 'quill-delta';
import { useCallback, useState } from 'react';
import { useMemo } from 'react';
import setQuillOptions from './setQuillOptions';

const useDocumentPreview = (doc: Document) => {
  const [quill, setQuill] = useState<Quill>();

  // set up preview quill
  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }

    setQuillOptions();

    wrapper.innerHTML = '';
    const Q = require('quill');

    const preview = document.createElement('div');
    wrapper.append(preview);

    const q: Quill = new Q(preview, {
      theme: 'snow',
      modules: { toolbar: '' },
    });
    q.disable();
    setQuill(q);
  }, []);

  useMemo(() => {
    if (doc && quill) {
      quill.setContents(doc.delta as Delta);
    }
  }, [doc, quill]);

  return { wrapperRef, quill };
};

export default useDocumentPreview;
