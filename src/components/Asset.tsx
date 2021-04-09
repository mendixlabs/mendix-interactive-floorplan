import classNames from "classnames";
import { event, select } from "d3-selection";
import { createElement, CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";
import { AssetObject } from "../util/assets";

export interface AssetProps {
    asset: AssetObject;
    overlayElement: SVGSVGElement | null;
}

const Asset = ({ asset }: AssetProps): JSX.Element => {
    const { textSelector, gElementSelector, elementClick } = useContext(FloorPlanContext);
    const { dispatch } = useContext(StoreContext);

    const assetRef = useRef<SVGGElement | null>(null);

    const [titleSet, setTitle] = useState(false);
    const [styleSet, setStyle] = useState(false);
    const [hover, setHover] = useState(false);

    // In order to avoid flickering rendering issues, we set visible to hidden and only show if we have done initial style/title setup
    const style: CSSProperties = titleSet && styleSet ? {} : { visibility: "hidden" };

    // TITLE
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

    // STYLING
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
    }, [asset, asset.id, asset.shapeStyling, gElementSelector, styleSet, assetRef]);

    // Tooltip
    useEffect(() => {
        if (!assetRef.current || !asset.popupEnabled) {
            return;
        }

        const selection = select(assetRef.current);
        selection.on("mouseover", () => {
            console.log(event.layerX, event.layerY);
            dispatch({ type: "COORS", layerX: event.layerX, layerY: event.layerY });
        });
    }, [assetRef, asset.popupEnabled]);

    const onClick = (): void => {
        if (elementClick && asset.isClickable && asset.obj) {
            const action = elementClick(asset.obj);
            if (action && action.canExecute && !action.isExecuting) {
                action.execute();
            }
        }
    };

    const onHover = (state: boolean): void => {
        // try {
        //     if (overlayElement && assetRef.current) {
        //         const bbBox = assetRef.current.getBBox();
        //         const x = bbBox.x + bbBox.width / 2;
        //         const y = bbBox.y + bbBox.height / 2;
        //         const offset = overlayElement.getBoundingClientRect();
        //         const mat = assetRef.current.getScreenCTM() as DOMMatrix;
        //         const absX = mat.a * x + mat.c * y + mat.e - offset.left;
        //         const absY = mat.b * x + mat.d * y + mat.f - offset.top;

        //         dispatch({ type: "COORS", layerX: absX, layerY: absY });
        //     }

        // } catch (error) {
        //     console.warn(error);
        // }

        setHover(state);
        dispatch({ type: "HOVER", id: state ? asset.obj : null, popup: state && asset.popupEnabled });
    };

    return (
        <g
            id={asset.id}
            className={classNames("asset", asset.className, {
                clickable: asset.isClickable,
                hover
            })}
            style={style}
            transform={asset.transform}
            ref={assetRef}
            onClick={onClick}
            onMouseEnter={() => {
                onHover(true);
            }}
            onMouseLeave={() => {
                onHover(false);
            }}
            dangerouslySetInnerHTML={{ __html: asset.xml }}
        />
    );
};

export default Asset;
