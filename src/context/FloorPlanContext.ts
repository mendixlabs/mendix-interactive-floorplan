import { createContext } from "react";
import { ListActionValue, ListWidgetValue } from "mendix";
export interface ContextVariables {
    textSelector: string | null;
    gElementSelector: string | null;
    mainSelector: string;
    elementClick: ListActionValue | null;
    popupArea: ListWidgetValue | null;
}

export const FloorPlanContext = createContext<ContextVariables>({
    textSelector: null,
    gElementSelector: null,
    mainSelector: "",
    elementClick: null,
    popupArea: null
});
