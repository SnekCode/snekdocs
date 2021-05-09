import Link from 'next/link';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import tw from 'twin.macro';
import { v4 as uuidV4 } from 'uuid';
import Card from '../components/Documents/Card';
import useDocuments from '../hooks/useDocuments';
import prisma from '../prisma/prisma';

const index = () => {
  const { documents } = useDocuments();

  const CardContainer = tw.div`flex flex-wrap justify-around`;

  return (
    <div>
      <h1>Snek Docs</h1>
      <Link href={`/document/${uuidV4()}`}>Create New Document</Link>
      <CardContainer>
        {documents
          ? documents.map((d) => (
              <div tw="hover:(outline[steelblue])" key={d.id}>
                <Card doc={d} />
              </div>
            ))
          : null}
      </CardContainer>
    </div>
  );
};

export default index;

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('documents', async () =>
    prisma.document.findMany()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
