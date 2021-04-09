import classNames from "classnames";
import { select } from "d3-selection";
import { createElement, CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { AssetObject } from "../util/assets";

export interface AssetProps {
    asset: AssetObject;
}

const Asset = ({ asset }: AssetProps): JSX.Element => {
    const { textSelector, gElementSelector, elementClick } = useContext(FloorPlanContext);
    const assetRef = useRef<SVGGElement | null>(null);

    const [titleSet, setTitle] = useState(false);
    const [styleSet, setStyle] = useState(false);

    // In order to avoid flickering rendering issues, we set visible to hidden and only show if we have done initial style/title setup
    const style: CSSProperties = titleSet && styleSet ? {} : { visibility: "hidden" };

    useEffect(() => {
        if (!assetRef.current) {
            return;
        }
        if (textSelector) {
            const selection = select(assetRef.current);
            selection.select(textSelector).text(asset.title);
        }
        setTitle(true);
    }, [asset.title, asset.xml, assetRef, textSelector, titleSet]);

    useEffect(() => {
        if (!assetRef.current) {
            return;
        }

        if (gElementSelector && asset.shapeStyling) {
            const selection = select(assetRef.current);
            const shape = selection.select(gElementSelector);
            try {
                const styleProps: { [key: string]: string } = JSON.parse(asset.shapeStyling);
                if (Object.keys(styleProps).length > 0) {
                    for (const key in styleProps) {
                        if (Object.prototype.hasOwnProperty.call(styleProps, key)) {
                            shape.style(key, styleProps[key]);
                        }
                    }
                }
            } catch (error) {
                console.warn("warning, styling not applied for: ", asset.id, error);
            }
        }

        setStyle(true);
    }, [asset, asset.id, asset.shapeStyling, gElementSelector, styleSet]);

    const onClick = (): void => {
        if (elementClick && asset.isClickable && asset.obj) {
            const action = elementClick(asset.obj);
            if (action && action.canExecute && !action.isExecuting) {
                action.execute();
            }
        }
    };

    return (
        <g
            id={asset.id}
            className={classNames("asset", asset.className, {
                clickable: asset.isClickable
                // ignore: !asset.isClickable
            })}
            style={style}
            transform={asset.transform}
            ref={assetRef}
            onClick={onClick}
            // onMouseEnter={() => asset.setHover(true)}
            // onMouseLeave={() => asset.setHover(false)}
            dangerouslySetInnerHTML={{ __html: asset.xml }}
        />
    );
};

export default Asset;
