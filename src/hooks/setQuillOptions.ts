const setQuillOptions = () => {
  const Quill = require('quill');
  const Size = Quill.import('attributors/style/size');
  Quill.register(Size, true);
  Size.whitelist = ['10px', '13px', '18px', '32px', '48px'];

  // Add fonts to whitelist
  const Font = Quill.import('formats/font');
  // We do not add Sans Serif since it is the default
  Font.whitelist = ['inconsolata', 'roboto', 'mirza'];
  Quill.register(Font, true);
};

export default setQuillOptions;
