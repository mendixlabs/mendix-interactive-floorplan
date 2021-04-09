import { createContext, createElement, Dispatch, useReducer } from "react";

export type StoreState = {
    transform: {
        x: number;
        y: number;
        k: number;
    };
};

export type StoreAction = { type: "ZOOM"; transform: { x: number; y: number; k: number } };

const initialState = {
    transform: {
        x: 0,
        y: 0,
        k: 0
    }
};

const StoreContext = createContext<{
    state: StoreState;
    dispatch: Dispatch<StoreAction>;
}>({
    state: initialState,
    dispatch: () => null
});

const mainReducer = (state: StoreState, action: StoreAction): StoreState => {
    if (action.type === "ZOOM") {
        return {
            ...state,
            transform: action.transform
        };
    }
    return state;
};

interface StateProviderProps {
    children?: JSX.Element;
}

const StateProvider = ({ children }: StateProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(mainReducer, initialState);

    return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export { StoreContext, StateProvider };
