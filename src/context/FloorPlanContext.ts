/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { createContext, ReactNode } from "react";

export interface ContextVariables {
    textSelector: string | null;
    gElementSelector: string | null;
    mainSelector: string;
    onItemClick: (id: string) => void;
    getHoverPopupContent: (id: string) => ReactNode;
    getClickPopupContent: (id: string) => ReactNode;
}

export const FloorPlanContext = createContext<ContextVariables>({
    textSelector: null,
    gElementSelector: null,
    mainSelector: "",
    onItemClick: (_id: string) => {},
    getHoverPopupContent: (_id: string) => null,
    getClickPopupContent: (_id: string) => null
});
