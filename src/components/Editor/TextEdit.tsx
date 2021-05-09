import Quill from 'quill';
import Toolbar from './Toolbar';

const TextEdit: React.FC<{
  wrapperRef: any;
  quill: Quill;
}> = ({ wrapperRef, quill }) => {
  return (
    <div>
      <Toolbar quill={quill} />
      <div ref={wrapperRef} className="editor"></div>;
    </div>
  );
};

export default TextEdit;
