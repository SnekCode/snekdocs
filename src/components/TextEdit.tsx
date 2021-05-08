const TextEdit: React.FC<{
  wrapperRef: any;
}> = ({ wrapperRef }) => {
  return <div ref={wrapperRef} className="editor"></div>;
};

export default TextEdit;
