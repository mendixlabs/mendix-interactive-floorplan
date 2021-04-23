/**
 * This file was generated from InteractiveFloorplan.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties } from "react";
import { DynamicValue, ListValue, ListActionValue, ListExpressionValue, ListWidgetValue } from "mendix";

export interface InteractiveFloorplanContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    textSVG: DynamicValue<string>;
    textSVGViewBox?: DynamicValue<string>;
    dataAssets: ListValue;
    getAssetID: ListExpressionValue<string>;
    getAssetXML: ListExpressionValue<string>;
    getAssetTransform: ListExpressionValue<string>;
    getAssetClassName?: ListExpressionValue<string>;
    popupHoverArea?: ListWidgetValue;
    popupClickArea?: ListWidgetValue;
    getAssetClickable: ListExpressionValue<boolean>;
    getAssetShowHoverPopup: ListExpressionValue<boolean>;
    getAssetShowClickPopup: ListExpressionValue<boolean>;
    showPageOverlayOnClickPopup: boolean;
    actionClickAsset?: ListActionValue;
    actionOnCloseClickPopup?: ListActionValue;
    uiSelectorText: string;
    uiSelectorGElement: string;
    uiMainSelectorG: string;
    popupOffsetJSON?: ListExpressionValue<string>;
    hoverPopupClassName?: ListExpressionValue<string>;
    clickPopupClassName?: ListExpressionValue<string>;
    getAssetShapeStyling?: ListExpressionValue<string>;
}

export interface InteractiveFloorplanPreviewProps {
    class: string;
    style: string;
    textSVG: string;
    textSVGViewBox: string;
    dataAssets: {} | null;
    getAssetID: string;
    getAssetXML: string;
    getAssetTransform: string;
    getAssetClassName: string;
    popupHoverArea: { widgetCount: number; renderer: ComponentType };
    popupClickArea: { widgetCount: number; renderer: ComponentType };
    getAssetClickable: string;
    getAssetShowHoverPopup: string;
    getAssetShowClickPopup: string;
    showPageOverlayOnClickPopup: boolean;
    actionClickAsset: {} | null;
    actionOnCloseClickPopup: {} | null;
    uiSelectorText: string;
    uiSelectorGElement: string;
    uiMainSelectorG: string;
    popupOffsetJSON: string;
    hoverPopupClassName: string;
    clickPopupClassName: string;
    getAssetShapeStyling: string;
}
