import { Document } from '@prisma/client';
import Link from 'next/link';

import tw from 'twin.macro';
import useDocumentPreview from '../../hooks/useDocumentPreview';

const CardContainer = tw.div`relative cursor-pointer border-4 hover:(border-blue-700) border[1px solid rgb(0, 0, 0)] rounded height[calc(13in*.2)] width[calc(9in*.2)] bg-gray-200`;
const PreviewContainer = tw.div`absolute border-b-2 transform-origin[top left] transform[scale(.2)]`;

const LabelContainer = tw.div`absolute bottom-0`;

const Card: React.FC<{ doc: Document }> = ({ doc }) => {
  const { wrapperRef } = useDocumentPreview(doc);

  return (
    <CardContainer>
      <PreviewContainer ref={wrapperRef} className="editor" />
      <LabelContainer>{doc.name}</LabelContainer>
    </CardContainer>
  );
};

export default Card;
