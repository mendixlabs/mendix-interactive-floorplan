import { createContext } from "react";

export interface ContextVariables {
    textSelector: string | null;
    gElementSelector: string | null;
}

export const FloorPlanContext = createContext<ContextVariables>({
    textSelector: null,
    gElementSelector: null
});
