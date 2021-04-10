import classNames from "classnames";
import { $, text, css } from "dom7";
import React, { createElement, CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";
import { AssetObject } from "../util/assets";

$.fn.text = text;
$.fn.css = css;

export interface AssetProps {
    asset: AssetObject;
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
            const selection = $(textSelector, assetRef.current);
            selection.text(asset.title);
        }
        if (!titleSet) {
            setTitle(true);
        }
    }, [asset.title, asset.xml, textSelector, titleSet]);

    // STYLING
    useEffect(() => {
        if (!assetRef.current) {
            return;
        }

        if (gElementSelector && asset.shapeStyling) {
            const shape = $(gElementSelector, assetRef.current);
            try {
                const styleProps: { [key: string]: string } = JSON.parse(asset.shapeStyling);
                shape.css(styleProps);
            } catch (error) {
                console.warn("warning, styling not applied for: ", asset.id, error);
            }
        }

        if (!styleSet) {
            setStyle(true);
        }
    }, [asset, asset.id, asset.shapeStyling, gElementSelector, styleSet]);

    const onClick = useCallback((): void => {
        if (elementClick && asset.isClickable && asset.obj) {
            const action = elementClick(asset.obj);
            if (action && action.canExecute && !action.isExecuting) {
                action.execute();
            }
        }
    }, [asset.isClickable, asset.obj, elementClick]);

    const onHover = useCallback(
        (state: boolean): void => {
            setHover(state);
            dispatch({ type: "HOVER", id: state ? asset.obj : null, popup: state && asset.popupEnabled });
        },
        [asset.obj, asset.popupEnabled, dispatch]
    );

    const dispathMouseEvent = useCallback(
        (e: React.MouseEvent<SVGGElement, MouseEvent>): void => {
            dispatch({
                type: "COORDS",
                layerX: e.nativeEvent.offsetX,
                layerY: e.nativeEvent.offsetY
            });
        },
        [dispatch]
    );

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
            onMouseEnter={e => {
                onHover(true);
                dispathMouseEvent(e);
            }}
            onMouseMove={dispathMouseEvent}
            onMouseLeave={() => {
                onHover(false);
            }}
            dangerouslySetInnerHTML={{ __html: asset.xml }}
        />
    );
};

// Asset.whyDidYouRender = true;

export default Asset;
