import Quill from 'quill';
import React from 'react';
import { Undo, Redo } from '@material-ui/icons';
import tw from 'twin.macro';

const StyledUndo = tw(Undo)`text-black`;
const StyledRedo = tw(Redo)`text-black`;

const Toolbar: React.FC<{ quill: Quill }> = ({ quill }) => {
  return (
    <div id="toolbar-container">
      <div>
        <button onClick={() => quill.history.undo()}>
          <StyledUndo />
        </button>
        <button onClick={() => quill.history.redo()}>
          <StyledRedo />
        </button>
      </div>
      <span className="ql-formats">
        <select className="ql-font">
          <option selected>Sans Serif</option>
          <option value="inconsolata">Inconsolata</option>
          <option value="roboto">Roboto</option>
          <option value="mirza">Mirza</option>
        </select>
        <select title="Size" className="ql-size">
          <option value="10px">Small</option>
          <option value="13px">Normal</option>
          <option value="18px">Large</option>
          <option value="32px">Huge</option>
          <option value="48px">Extra Huge</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-color"></select>
        <select className="ql-background"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-blockquote"></button>
        <button className="ql-code-block"></button>
        <button className="ql-link"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-header" value="1"></button>
        <button className="ql-header" value="2"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
    </div>
  );
};

export default Toolbar;
