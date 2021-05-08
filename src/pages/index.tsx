import axios from 'axios';
import Link from 'next/link';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { v4 as uuidV4 } from 'uuid';
import useDocuments from '../hooks/useDocuments';
import prisma from '../prisma/prisma';

const index = () => {
  const { documents } = useDocuments();

  return (
    <div>
      <h1>Snek Docs</h1>
      <Link href={`/document/${uuidV4()}`}>Create New Document</Link>
      {documents
        ? documents.map((d) => (
            <div key={d.id}>
              <Link href={`/document/${d.id}`}>
                {d.name ? d.name : 'Untitled Document'}
              </Link>
            </div>
          ))
        : null}
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
