import { Document } from '@prisma/client';

import tw from 'twin.macro';

const CardContainer = tw.div`relative cursor-pointer border-4 hover:(border-blue-700) border[1px solid rgb(0, 0, 0)] rounded height[calc(13in*.2)] width[calc(10in*.2)] bg-gray-200`;
const Preview = tw.img`absolute transform-origin[top left] max-h-full max-w-full w-full`;
const LabelContainer = tw.div`absolute bottom-0 z-40`;

const Card: React.FC<{ doc: Document }> = ({ doc }) => {
  return (
    <CardContainer>
      <Preview
        src={doc.snapShot}
        // tw="absolute border-b-2 transform-origin[top left] transform[scale(.2)] height[11in] width[8in]"
      />
      <LabelContainer>{doc.name}</LabelContainer>
    </CardContainer>
  );
};

export default Card;
