import { NextApiRequest, NextApiResponse } from 'next';

export const documentApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { body, method } = req;
  switch (method) {
    // HTTP POST method case to create a user
    case 'POST': {
      // Id must be null other wise prisma will throw an exception if it exists in DB
      if (body.id) {
        res.status(400).end(`ID must be null`);
        break;
      }
      res.status(501).json('Not Implemented Yet check back later 😘');
      break;
    }

    // Disallow all methods except POST
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default documentApiHandler;
