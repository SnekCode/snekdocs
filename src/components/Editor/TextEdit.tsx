import Toolbar, { ICustomQuill } from './Toolbar';

const TextEdit: React.FC<{
  wrapperRef: any;
  quill: ICustomQuill;
}> = ({ wrapperRef, quill }) => {
  return (
    <div>
      <Toolbar quill={quill} />
      <div ref={wrapperRef} className="editor"></div>;
    </div>
  );
};

export default TextEdit;
