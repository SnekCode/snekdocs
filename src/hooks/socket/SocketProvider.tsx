// hook for useUser
import React, { createContext, useState, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

interface ISocketContext {
  isLoading: boolean;
  error?: string | null;
  socket?: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const missingUserProvider = 'You forgot to wrap your app in <SocketProvider>';

export const SocketContext = createContext<ISocketContext>({
  get isLoading(): never {
    throw new Error(missingUserProvider);
  },
  get error(): never {
    throw new Error(missingUserProvider);
  },
  get socket(): never {
    throw new Error(missingUserProvider);
  },
});

function SocketContextProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useRef(true);

  const [state, setState] = useState<ISocketContext>({
    isLoading: true,
    error: null,
    socket: null,
  });

  useMemo(() => {
    if (!state.socket) {
      const socket = io();
      setState((prevState) => ({
        ...prevState,
        socket,
        isLoading: false,
      }));
    }

    if (state.socket)
      (async () => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      })();

    return () => {
      isMounted.current = false;
      state.socket.disconnect();
    };
  }, [state.socket]);

  return (
    <SocketContext.Provider value={{ ...state }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContextProvider };

export type { ISocketContext };
