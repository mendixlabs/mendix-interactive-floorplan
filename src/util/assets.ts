import { ObjectItem, DynamicValue } from "mendix";

export interface AssetObject {
    id: string;
    obj: ObjectItem;
    title: string;
    xml: string;
    transform: string;
    shapeStyling: string;
    isClickable: boolean;
}

export const getAssetObjects = (
    funcs: {
        getTitle: (obj: ObjectItem) => DynamicValue<string>;
        getXML: (obj: ObjectItem) => DynamicValue<string>;
        getTransform: (obj: ObjectItem) => DynamicValue<string>;
        getClickable: (obj: ObjectItem) => DynamicValue<boolean>;
        getShapeStyling?: (obj: ObjectItem) => DynamicValue<string>;
    },
    items?: ObjectItem[]
): AssetObject[] => {
    const { getTitle, getXML, getTransform, getClickable, getShapeStyling } = funcs;
    if (!items) {
        return [];
    }
    const assetObjects: AssetObject[] = items.map(obj => {
        const id = obj.id;
        const title = getTitle(obj).value;
        const xml = getXML(obj).value;
        const transform = getTransform(obj).value;
        const isClickable = getClickable(obj).value;
        const shapeStyling = getShapeStyling ? getShapeStyling(obj).value : "";

        return {
            id,
            obj,
            title,
            xml,
            transform,
            shapeStyling,
            isClickable
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
