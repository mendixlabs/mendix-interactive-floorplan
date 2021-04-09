import { createContext, createElement, Dispatch, useReducer } from "react";
import { ObjectItem } from "mendix";

export type StoreState = {
    hoverElement: ObjectItem | null;
    showPopup: boolean;
    hoverCoords: {
        layerX: number;
        layerY: number;
    };
};

export type StoreAction =
    | { type: "HOVER"; id: ObjectItem | null; popup: boolean }
    | { type: "COORS"; layerX: number; layerY: number };

const initialState = {
    hoverElement: null,
    showPopup: false,
    hoverCoords: {
        layerX: 0,
        layerY: 0
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
    if (action.type === "HOVER") {
        return {
            ...state,
            hoverElement: action.id,
            showPopup: action.popup
        };
    } else if (action.type === "COORS") {
        return {
            ...state,
            hoverCoords: {
                layerX: action.layerX,
                layerY: action.layerY
            }
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
