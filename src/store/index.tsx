import { createContext, createElement, Dispatch, useReducer } from "react";

export type StoreState = {
    selectedItem: string | null;
    showHoverPopup: boolean;
    showClickPopup: boolean;
    popupCoords: {
        x: number;
        y: number;
    };
    svgSizes: {
        width: number;
        height: number;
    };
};

export type StoreAction =
    | { type: "HOVER"; id: string | null; popup: boolean }
    | { type: "CLICKED"; id: string | null; popup: boolean }
    | {
          type: "COORDS";
          x: number;
          y: number;
      }
    | { type: "SETSIZE"; width: number; height: number };

const initialState: StoreState = {
    selectedItem: null,
    showHoverPopup: false,
    showClickPopup: false,
    popupCoords: {
        x: 0,
        y: 0
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
            selectedItem: action.id,
            showHoverPopup: action.popup
        };
    } else if (action.type === "COORDS") {
        return {
            ...state,
            popupCoords: {
                x: action.x,
                y: action.y
            }
        };
    } else if (action.type === "CLICKED") {
        return {
            ...state,
            selectedItem: action.id,
            showClickPopup: action.popup
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
