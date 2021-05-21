import { LegacyRef } from 'react';
import Toolbar, { ICustomQuill } from './Toolbar';

const TextEdit: React.FC<{
  wrapperRef: LegacyRef<HTMLDivElement>;
  quill: ICustomQuill;
}> = ({ wrapperRef, quill }) => {
  return (
    <div>
      <Toolbar quill={quill} />
      <div id="canvas" ref={wrapperRef} className="editor"></div>;
    </div>
  );
};

export default TextEdit;
