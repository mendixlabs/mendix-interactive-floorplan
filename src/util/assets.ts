import { ObjectItem, ListWidgetValue } from "mendix";
import { ReactNode } from "react";
import { InteractiveFloorplanContainerProps } from "../../typings/InteractiveFloorplanProps";

export interface AssetObject {
    id: string;
    title: string;
    xml: string;
    transform: string;
    shapeStyling: string;
    hoverPopupEnabled: boolean;
    clickPopupEnabled: boolean;
    isClickable: boolean;
    className: string;
}

export const getAssetObjects = ({
    getAssetID,
    getAssetXML,
    getAssetTransform,
    getAssetClickable,
    getAssetShowHoverPopup,
    getAssetShowClickPopup,
    getAssetShapeStyling,
    getAssetClassName,
    actionClickAsset,
    popupClickArea,
    dataAssets
}: InteractiveFloorplanContainerProps): AssetObject[] => {
    const items = dataAssets.items;
    const clickActionDefined = !!actionClickAsset || !!popupClickArea;
    if (!items) {
        return [];
    }
    const assetObjects: AssetObject[] = items.map(obj => {
        const id = obj.id;
        const title = getAssetID(obj).value;
        const xml = getAssetXML(obj).value;
        const transform = getAssetTransform(obj).value;
        const isClickable = clickActionDefined && getAssetClickable(obj).value;
        const hoverPopupEnabled = getAssetShowHoverPopup(obj).value;
        const clickPopupEnabled = getAssetShowClickPopup(obj).value;
        const shapeStyling = getAssetShapeStyling ? getAssetShapeStyling(obj).value : "";
        const className = getAssetClassName ? getAssetClassName(obj).value : "";

        return {
            id,
            title,
            xml,
            transform,
            shapeStyling,
            isClickable,
            hoverPopupEnabled,
            clickPopupEnabled,
            className
        } as AssetObject;
    });

    if (
        assetObjects.some(
            x =>
                typeof x.title === "undefined" ||
                typeof x.xml === "undefined" ||
                typeof x.transform === "undefined" ||
                typeof x.isClickable === "undefined"
        )
    ) {
        return [];
    }
    return assetObjects;
};

export const getPopupArea = (items: ObjectItem[] = [], popupArea?: ListWidgetValue): ((id: string) => ReactNode) => {
    return (id: string): ReactNode => {
        if (!id || !popupArea) {
            return null;
        }
        const object = items.find(obj => obj.id === id);
        if (object) {
            return popupArea(object);
        }
        return null;
    };
};
