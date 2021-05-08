import axios from 'axios';
import { useQuery } from 'react-query';
import { Document } from '@prisma/client';

const useDocuments = () => {
  const { data: documents } = useQuery(
    'documents',
    (): Promise<Document[]> => axios.get('/api/documents')
  );

  return { documents };
};

export default useDocuments;
