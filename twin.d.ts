import 'twin.macro';
import styledImport, { CSSProp, css as cssImport } from 'styled-components';

// twin.d.ts
import 'twin.macro';
import styledImport from '@emotion/styled';
import { css as cssImport } from '@emotion/core';

// Allow interpolation: css`${MyStyledComponent}:hover & { //... }`
type Interpolation = ObjectInterpolation<undefined>;

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport | Interpolation;
  const css: typeof cssImport | Interpolation;
}

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSProp;
  }
}

// The 'as' prop on styled components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string | Element;
    }
  }
}
