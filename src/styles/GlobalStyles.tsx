import React from 'react';
import { createGlobalStyle } from 'styled-components';
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro';

const CustomStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box
  };
  body {
    background-color: #f3f3f3;
    margin: 0;
    font-family: ${theme`fontFamily.default`};
    /* color: ${theme`colors.purple.500`}; */
    ${tw`antialiased`}
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
