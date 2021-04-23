import { ObjectItem, ListActionValue, ListWidgetValue, ListExpressionValue } from "mendix";
import { ReactNode } from "react";

export const executeAction = (id?: string, items?: ObjectItem[], actionValue?: ListActionValue): void => {
    if (!id) {
        return;
    }
    const object = items?.find(obj => obj.id === id);
    if (object && actionValue) {
        const action = actionValue(object);
        if (action && action.canExecute && !action.isExecuting) {
            action.execute();
        }
    }
};

const getContent = (id?: string, items?: ObjectItem[], area?: ListWidgetValue): ReactNode => {
    if (!id || !area || !items) {
        return null;
    }
    const object = items.find(obj => obj.id === id);
    if (object) {
        return area(object);
    }
    return null;
};

export const getJSONObject = <T>(jsonString: string): T => {
    if (!jsonString) {
        return {} as T;
    }
    try {
        const parsed = JSON.parse(jsonString) as T;
        return parsed;
    } catch (error) {
        // console.warn(
        //     `Error parsing JSON for Asset Styling! Have you correctly configured this?: ${jsonString} `,
        //     error
        // );
        return {} as T;
    }
};

const getStringValueExpression = (
    id?: string,
    items?: ObjectItem[],
    getValue?: ListExpressionValue<string>
): string => {
    if (!id || !items || !getValue) {
        return "";
    }
    const object = items.find(obj => obj.id === id);
    return object ? getValue(object).value || "" : "";
};

export interface TooltipOffset {
    x: number;
    y: number;
}
export const defaultTooltipOffset: TooltipOffset = {
    x: 15,
    y: -40
};

export interface PopupContent {
    content: ReactNode;
    className: string;
    offset: TooltipOffset;
}

export const getPopupContent = (
    id?: string,
    items?: ObjectItem[],
    area?: ListWidgetValue,
    className?: ListExpressionValue<string>,
    tooltipOffsetGetter?: ListExpressionValue<string>
): PopupContent => {
    const offset = {
        ...defaultTooltipOffset,
        ...getJSONObject<TooltipOffset>(getStringValueExpression(id, items, tooltipOffsetGetter))
    };
    return {
        content: getContent(id, items, area),
        className: getStringValueExpression(id, items, className),
        offset
    };
};
