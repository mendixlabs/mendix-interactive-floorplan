import { ObjectItem, DynamicValue } from "mendix";

export interface AssetObject {
    id: string;
    title: string;
    xml: string;
    transform: string;
    shapeStyling: string;
    popupEnabled: boolean;
    isClickable: boolean;
    className: string;
}

export const getAssetObjects = (
    funcs: {
        getTitle: (obj: ObjectItem) => DynamicValue<string>;
        getXML: (obj: ObjectItem) => DynamicValue<string>;
        getTransform: (obj: ObjectItem) => DynamicValue<string>;
        getClickable: (obj: ObjectItem) => DynamicValue<boolean>;
        getPopupEnabled: (obj: ObjectItem) => DynamicValue<boolean>;
        getShapeStyling?: (obj: ObjectItem) => DynamicValue<string>;
        getClassName?: (obj: ObjectItem) => DynamicValue<string>;
    },
    clickActionDefined: boolean,
    items?: ObjectItem[]
): AssetObject[] => {
    const { getTitle, getXML, getTransform, getClickable, getPopupEnabled, getShapeStyling, getClassName } = funcs;
    if (!items) {
        return [];
    }
    const assetObjects: AssetObject[] = items.map(obj => {
        const id = obj.id;
        const title = getTitle(obj).value;
        const xml = getXML(obj).value;
        const transform = getTransform(obj).value;
        const isClickable = clickActionDefined && getClickable(obj).value;
        const popupEnabled = getPopupEnabled(obj).value;
        const shapeStyling = getShapeStyling ? getShapeStyling(obj).value : "";
        const className = getClassName ? getClassName(obj).value : "";

        return {
            id,
            title,
            xml,
            transform,
            shapeStyling,
            isClickable,
            popupEnabled,
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
