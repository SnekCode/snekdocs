import { Document } from '@prisma/client';
import Quill from 'quill';
import Delta from 'quill-delta';
import Link from 'next/link';

import { useMemo } from 'react';
import tw from 'twin.macro';
import useDocumentPreview from '../../hooks/useDocumentPreview';

const CardContainer = tw.div`relative cursor-pointer border-4 hover:(border-blue-700) border[1px solid rgb(0, 0, 0)] rounded height[calc(13in*.2)] width[calc(9in*.2)] bg-gray-200`;
const PreviewContainer = tw.div`absolute border-b-2 transform-origin[top left] transform[scale(.2)]`;

const LabelContainer = tw.div`absolute bottom-0`;

const Card: React.FC<{ doc: Document }> = ({ doc }) => {
  const { wrapperRef, quill } = useDocumentPreview();

  useMemo(() => {
    if (quill) {
      quill.setContents(doc.delta as Delta);
    }
  }, [doc, quill]);

  return (
    <Link href={`/document/${doc.id}`}>
      <CardContainer>
        <PreviewContainer ref={wrapperRef} id="preview"></PreviewContainer>

        <LabelContainer>{doc.name}</LabelContainer>
      </CardContainer>
    </Link>
  );
};

export default Card;
