import { createContext } from "react";
import { ListActionValue } from "mendix";
export interface ContextVariables {
    textSelector: string | null;
    gElementSelector: string | null;
    elementClick: ListActionValue | null;
}

export const FloorPlanContext = createContext<ContextVariables>({
    textSelector: null,
    gElementSelector: null,
    elementClick: null
});
