import { useRouter } from 'next/router';
import React from 'react';
import TextEdit from '../../components/TextEdit';

const Document = () => {
  const router = useRouter();
  const { id } = router.query;
  const documentId: string = id as string;
  // if (id && !(typeof id === 'string') && process.browser) {
  //   throw Error('Document does not exist, Check URL');
  // }

  return <TextEdit documentId={documentId} />;
};

export default Document;
