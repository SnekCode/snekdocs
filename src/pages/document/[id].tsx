import { useRouter } from 'next/router';
import TextEdit from '../../components/Editor/TextEdit';
import { validate } from 'uuid';
import useQuillDocumentSocket from '../../hooks/useDocumentSocket';
import { useState } from 'react';
import { useMemo } from 'react';
import prisma from '../../prisma/prisma';
import DescriptionIcon from '@material-ui/icons/Description';
import Link from 'next/link';
import 'twin.macro';
import tw from 'twin.macro';

const StyledLink = tw(Link)`cursor-pointer relative`;
const GoHomeIcon = tw(DescriptionIcon)`text-4xl m-2 cursor-pointer`;
const Tooltip = tw.div`absolute bg-black text-white left-1/2 w-max invisible pointer-events-none group-hover:(visible transition-all delay-700 z-50)`;

const NameField = tw.input`background-color[#f3f3f3] mt-0.5 border-2 border-color[#f3f3f3] h-6 w-max hover:(border-2 border-gray-500)`;

const Document = ({ documentName }) => {
  const router = useRouter();
  const { id } = router.query;
  const documentId: string = id as string;

  const [title, setTitle] = useState(documentName);
  // state to trigger socket emit.  Tied to on blur of title input
  const [savedTitle, setSavedTitle] = useState(documentName);

  const { wrapperRef: ref, quillRef, socket, quill } = useQuillDocumentSocket(
    documentId
  );

  // set up socket for title
  useMemo(() => {
    if (socket) {
      socket.emit('title-change', savedTitle);

      const handler = (name) => {
        setTitle(name);
      };

      // listens for changes emitted from the server
      socket.on('title-receive', handler);

      return () => {
        socket.off('title-receive', handler);
      };
    }
  }, [socket, savedTitle]);

  return (
    <>
      <div tw="">
        <StyledLink href="/">
          <div tw="relative" className="group">
            <GoHomeIcon>TEXT</GoHomeIcon>
            <Tooltip>Docs Home</Tooltip>
          </div>
        </StyledLink>
        <NameField
          placeholder="Untitled Document"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const editor: HTMLDivElement = quillRef.current.getElementsByClassName(
                'ql-editor'
              )[0] as HTMLDivElement;
              editor.focus();
              e.preventDefault();
            }
          }}
          onBlur={() => setSavedTitle(title)}
        />
      </div>
      <TextEdit quill={quill} wrapperRef={ref} />;
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  if (!validate(id)) {
    context.res.redirect(`/`);
  }

  const documentName = await (
    await prisma.document.findUnique({ where: { id } })
  )?.name;

  return { props: { documentName } };
};

export default Document;
