import { NextApiHandler, NextApiRequest } from 'next';
import verifySignature from '../utils/Cypto';

const signatureRequired = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res) => {
    if (!verifySignature(req.headers, req.body)) {
      return null;
    }

    return handler(req, res);
  };
};

export default signatureRequired;
