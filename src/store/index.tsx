import { createContext, createElement, Dispatch, useReducer } from "react";

export type StoreState = {
    selectedInitial: string | null;
    selectedHoverItem: string | null;
    selectedClickItem: string | null;
    viewBox: string | null;
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
        rect: DOMRect;
    };
};

export type StoreAction =
    | { type: "HOVER"; id: string | null; popup: boolean }
    | { type: "CLICKED"; id: string | null; popup: boolean }
    | { type: "VIEWBOX"; viewBox: string }
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
    | { type: "SETSIZE"; width: number; height: number; rect: DOMRect };

const startState: StoreState = {
    selectedInitial: null,
    selectedClickItem: null,
    selectedHoverItem: null,
    showHoverPopup: false,
    showClickPopup: false,
    viewBox: "",
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
        height: 1,
        rect: new DOMRect()
    }
};

const StoreContext = createContext<{
    state: StoreState;
    dispatch: Dispatch<StoreAction>;
}>({
    state: startState,
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
                height: action.height,
                rect: action.rect
            }
        };
    } else if (action.type === "VIEWBOX") {
        return {
            ...state,
            viewBox: action.viewBox
        };
    }
    return state;
};

interface StateProviderProps {
    initialState?: Partial<StoreState>;
    children?: JSX.Element;
}

const StateProvider = ({ children, initialState }: StateProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(mainReducer, { ...startState, ...initialState });

    return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export { StoreContext, StateProvider };
