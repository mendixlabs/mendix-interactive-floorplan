import classNames from "classnames";
import { $, text, css } from "dom7";
import React, {
    createElement,
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

$.fn.text = text;
$.fn.css = css;

export interface AssetProps {
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

const Asset = ({
    id,
    title,
    xml,
    transform,
    shapeStyling,
    hoverPopupEnabled,
    clickPopupEnabled,
    isClickable,
    className
}: AssetProps): JSX.Element => {
    const { textSelector, gElementSelector, onItemClick } = useContext(FloorPlanContext);
    const { dispatch, state } = useContext(StoreContext);
    const { svgSizes } = state;

    const assetRef = useRef<SVGGElement | null>(null);

    const [titleSet, setTitle] = useState(false);
    const [styleSet, setStyle] = useState(false);
    const [hover, setHover] = useState(false);

    // In order to avoid flickering rendering issues, we set visible to hidden and only show if we have done initial style/title setup
    const style: CSSProperties = useMemo(() => (titleSet && styleSet ? {} : { visibility: "hidden" }), [
        titleSet,
        styleSet
    ]);

    // TITLE
    useEffect(() => {
        if (!assetRef.current) {
            return;
        }
        if (textSelector) {
            const selection = $(textSelector, assetRef.current);
            selection.text(title);
        }
        if (!titleSet) {
            setTitle(true);
        }
    }, [title, xml, textSelector, titleSet]);

    // STYLING
    useEffect(() => {
        if (!assetRef.current) {
            return;
        }

        if (gElementSelector && shapeStyling) {
            const shape = $(gElementSelector, assetRef.current);
            try {
                const styleProps: { [key: string]: string } = JSON.parse(shapeStyling);
                shape.css(styleProps);
            } catch (error) {
                console.warn("warning, styling not applied for: ", id, error);
            }
        }

        if (!styleSet) {
            setStyle(true);
        }
    }, [id, shapeStyling, gElementSelector, styleSet]);

    const onClick = useCallback((): void => {
        if (isClickable) {
            if (clickPopupEnabled) {
                const currentRect = (assetRef.current as SVGGElement).getBoundingClientRect();
                const parentRect = svgSizes.rect;
                const top = Math.round(currentRect.top - parentRect.top + currentRect.height / 2);
                const left = Math.round(currentRect.left - parentRect.left + currentRect.width / 2);
                dispatch({ type: "CLICKCOORDS", x: left, y: top });
                dispatch({ type: "CLICKED", id, popup: true });
            }

            if (onItemClick) {
                onItemClick(id);
            }
        }
    }, [isClickable, clickPopupEnabled, onItemClick, svgSizes.rect, dispatch, id]);

    const onHover = useCallback(
        (state: boolean): void => {
            if (hoverPopupEnabled) {
                setHover(state);
                dispatch({ type: "HOVER", id: state ? id : null, popup: state && hoverPopupEnabled });
            }
        },
        [hoverPopupEnabled, dispatch, id]
    );

    const dispathMouseEvent = useCallback(
        (e: React.MouseEvent<SVGGElement, MouseEvent>): void => {
            if (hoverPopupEnabled) {
                dispatch({
                    type: "HOVERCOORDS",
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY
                });
            }
        },
        [dispatch, hoverPopupEnabled]
    );

    return (
        <g
            id={id}
            className={classNames("asset", className, {
                clickable: isClickable,
                hover
            })}
            style={style}
            transform={transform}
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
            dangerouslySetInnerHTML={{ __html: xml }}
        />
    );
};

// Asset.whyDidYouRender = true;

export default Asset;
