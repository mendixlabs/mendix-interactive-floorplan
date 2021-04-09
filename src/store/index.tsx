import { createContext, createElement, Dispatch, useReducer } from "react";

export type StoreState = {
    hoverElement: string | null;
};

export type StoreAction = { type: "HOVER"; id: string | null };

const initialState = {
    hoverElement: null
};

const StoreContext = createContext<{
    state: StoreState;
    dispatch: Dispatch<StoreAction>;
}>({
    state: initialState,
    dispatch: () => null
});

const mainReducer = (state: StoreState, action: StoreAction): StoreState => {
    if (action.type === "HOVER") {
        return {
            ...state,
            hoverElement: action.id
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
