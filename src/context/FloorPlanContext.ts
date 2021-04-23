/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { createContext } from "react";
import { defaultTooltipOffset, PopupContent } from "../util";

export interface ContextVariables {
    textSelector: string | null;
    gElementSelector: string | null;
    autoDetermineViewBox: boolean;
    mainSelector: string;
    showPageOverlayOnClickPopup: boolean;
    onItemClick: (id: string) => void;
    onClosePopup: (id?: string) => void;
    getHoverPopupContent: (id?: string | null) => PopupContent;
    getClickPopupContent: (id?: string | null) => PopupContent;
}

export const FloorPlanContext = createContext<ContextVariables>({
    textSelector: null,
    gElementSelector: null,
    autoDetermineViewBox: true,
    mainSelector: "",
    showPageOverlayOnClickPopup: true,
    onItemClick: (_id: string) => {},
    onClosePopup: (_id?: string) => {},
    getHoverPopupContent: (_id: string) => ({ content: null, className: "", offset: defaultTooltipOffset }),
    getClickPopupContent: (_id: string) => ({ content: null, className: "", offset: defaultTooltipOffset })
});
