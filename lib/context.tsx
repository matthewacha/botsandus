import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react';

import { positionReducer, Action, State } from './utils';

const defaultContext: State = {
  x: 0,
  y: 0,
  angle: 0
};

type ContextI = {
  state: State;
  dispatch: Dispatch<Action>;
};

export const StreamContext = createContext<ContextI | null>(null);

export const StreamContextProvider = ({ children}: {children: ReactNode}) => {
  const [ state, dispatch] = useReducer(positionReducer, defaultContext);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );
  return <StreamContext.Provider value={ value }>{children}</StreamContext.Provider>;
};
