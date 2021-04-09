/**
 * This file was generated from InteractiveFloorplan.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { DynamicValue, ListValue, ListExpressionValue } from "mendix";

export interface InteractiveFloorplanContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    textSVG: DynamicValue<string>;
    textSVGViewBox: DynamicValue<string>;
    dataAssets: ListValue;
    getAssetID: ListExpressionValue<string>;
    getAssetXML: ListExpressionValue<string>;
    getAssetTransform: ListExpressionValue<string>;
    getAssetClassName?: ListExpressionValue<string>;
    getAssetClickable: ListExpressionValue<boolean>;
    getAssetShowpopup: ListExpressionValue<boolean>;
    uiSelectorText: string;
    uiSelectorGElement: string;
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
    getAssetClickable: string;
    getAssetShowpopup: string;
    uiSelectorText: string;
    uiSelectorGElement: string;
    getAssetShapeStyling: string;
}
