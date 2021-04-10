import { createContext, createElement, Dispatch, useReducer } from "react";
import { ObjectItem } from "mendix";

export type StoreState = {
    hoverElement: ObjectItem | null;
    showPopup: boolean;
    hoverCoords: {
        layerX: number;
        layerY: number;
    };
    svgSizes: {
        width: number;
        height: number;
    };
};

export type StoreAction =
    | { type: "HOVER"; id: ObjectItem | null; popup: boolean }
    | {
          type: "COORDS";
          layerX: number;
          layerY: number;
      }
    | { type: "SETSIZE"; width: number; height: number };

const initialState: StoreState = {
    hoverElement: null,
    showPopup: false,
    hoverCoords: {
        layerX: 0,
        layerY: 0
    },
    svgSizes: {
        width: 1,
        height: 1
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
    } else if (action.type === "COORDS") {
        return {
            ...state,
            hoverCoords: {
                layerX: action.layerX,
                layerY: action.layerY
            }
        };
    } else if (action.type === "SETSIZE") {
        return {
            ...state,
            svgSizes: {
                width: action.width,
                height: action.height
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
