import Quill from 'quill';
import React, { useCallback, useState } from 'react';

const useDocumentPreview = () => {
  const [quill, setQuill] = useState<Quill>();

  // set up preview quill
  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }

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

  return { wrapperRef, quill };
};

export default useDocumentPreview;
