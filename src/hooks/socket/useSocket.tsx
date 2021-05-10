import { useContext } from 'react';
import { ISocketContext, SocketContext } from './SocketProvider';

// Hooks
export const useSocket = (): ISocketContext => {
  return useContext<ISocketContext>(SocketContext);
};
