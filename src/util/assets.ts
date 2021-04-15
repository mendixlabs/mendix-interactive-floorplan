import { ObjectItem, DynamicValue, ListWidgetValue } from "mendix";
import { ReactNode } from "react";

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

export const getAssetObjects = (
    funcs: {
        getTitle: (obj: ObjectItem) => DynamicValue<string>;
        getXML: (obj: ObjectItem) => DynamicValue<string>;
        getTransform: (obj: ObjectItem) => DynamicValue<string>;
        getClickable: (obj: ObjectItem) => DynamicValue<boolean>;
        getHoverPopupEnabled: (obj: ObjectItem) => DynamicValue<boolean>;
        getClickPopupEnabled: (obj: ObjectItem) => DynamicValue<boolean>;
        getShapeStyling?: (obj: ObjectItem) => DynamicValue<string>;
        getClassName?: (obj: ObjectItem) => DynamicValue<string>;
    },
    clickActionDefined: boolean,
    items?: ObjectItem[]
): AssetObject[] => {
    const {
        getTitle,
        getXML,
        getTransform,
        getClickable,
        getHoverPopupEnabled,
        getClickPopupEnabled,
        getShapeStyling,
        getClassName
    } = funcs;
    if (!items) {
        return [];
    }
    const assetObjects: AssetObject[] = items.map(obj => {
        const id = obj.id;
        const title = getTitle(obj).value;
        const xml = getXML(obj).value;
        const transform = getTransform(obj).value;
        const isClickable = clickActionDefined && getClickable(obj).value;
        const hoverPopupEnabled = getHoverPopupEnabled(obj).value;
        const clickPopupEnabled = getClickPopupEnabled(obj).value;
        const shapeStyling = getShapeStyling ? getShapeStyling(obj).value : "";
        const className = getClassName ? getClassName(obj).value : "";

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
