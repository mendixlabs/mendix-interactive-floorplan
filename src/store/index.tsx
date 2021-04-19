import { createContext, createElement, Dispatch, useReducer } from "react";

export type StoreState = {
    selectedHoverItem: string | null;
    selectedClickItem: string | null;
    showHoverPopup: boolean;
    showClickPopup: boolean;
    hoverCoords: {
        x: number;
        y: number;
    };
    clickCoords: {
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
          type: "HOVERCOORDS";
          x: number;
          y: number;
      }
    | {
          type: "CLICKCOORDS";
          x: number;
          y: number;
      }
    | { type: "SETSIZE"; width: number; height: number };

const initialState: StoreState = {
    selectedClickItem: null,
    selectedHoverItem: null,
    showHoverPopup: false,
    showClickPopup: false,
    hoverCoords: {
        x: 0,
        y: 0
    },
    clickCoords: {
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
            selectedHoverItem: action.id,
            showHoverPopup: action.popup
        };
    } else if (action.type === "HOVERCOORDS") {
        return {
            ...state,
            hoverCoords: {
                x: action.x,
                y: action.y
            }
        };
    } else if (action.type === "CLICKCOORDS") {
        return {
            ...state,
            clickCoords: {
                x: action.x,
                y: action.y
            }
        };
    } else if (action.type === "CLICKED") {
        return {
            ...state,
            selectedClickItem: action.id,
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
