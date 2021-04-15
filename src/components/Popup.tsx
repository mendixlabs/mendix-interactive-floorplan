import { createElement, CSSProperties, useContext, useMemo, useRef } from "react";
import { useKeyPress, useClickAway, useDebounce } from "ahooks";
import classNames from "classnames";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

const tooltipOffset = {
    x: 15,
    y: -40
};

const getPositionStyle = (
    svgSizes: { width: number; height: number },
    coords: { x: number; y: number }
): { positionX: "right" | "left"; positionY: "top" | "bottom"; style: CSSProperties } => {
    const positionX = coords.x >= svgSizes.width / 2 ? "right" : "left";
    const positionY = coords.y >= svgSizes.height / 2 ? "bottom" : "top";

    const style: CSSProperties = {};

    if (positionX === "left") {
        style.left = coords.x + tooltipOffset.x;
    } else {
        style.right = svgSizes.width - coords.x + tooltipOffset.x;
    }

    if (positionY === "top") {
        style.top = coords.y + tooltipOffset.y;
    } else {
        style.bottom = svgSizes.height - coords.y + tooltipOffset.y;
    }

    return {
        positionX,
        positionY,
        style
    };
};

export const HoverPopup = (): JSX.Element => {
    const { getHoverPopupContent, getClickPopupContent } = useContext(FloorPlanContext);
    const ref = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useContext(StoreContext);
    const { popupCoords: hover, svgSizes, selectedItem, showHoverPopup, showClickPopup } = state;
    const showPopup = selectedItem !== null && !!hover;

    const shown = useDebounce(showPopup, { wait: 500 });

    const closePopup = (): void => {
        dispatch({ type: "CLICKED", id: null, popup: false });
    };

    useKeyPress("esc", () => {
        closePopup();
    });

    useClickAway(() => {
        if (showClickPopup && showPopup && shown) {
            closePopup();
        }
    }, ref);

    const popup =
        selectedItem !== null
            ? showHoverPopup
                ? getHoverPopupContent(selectedItem)
                : showClickPopup
                ? getClickPopupContent(selectedItem)
                : null
            : null;
    const positionStyle = useMemo(() => getPositionStyle(svgSizes, hover), [svgSizes, hover]);
    const { style, positionX, positionY } = positionStyle;
    const closeButton = useMemo(
        () => (
            <button
                type="button"
                className={classNames("close")}
                data-dismiss="modal"
                aria-label="Close"
                onClick={closePopup}
            >
                <span aria-hidden="true">×</span>
            </button>
        ),
        []
    );

    return (
        <div
            className={classNames(
                "tooltip",
                "interactive-floorplan--tooltip",
                { hide: !showPopup },
                positionX,
                positionY
            )}
            style={showPopup ? style : {}}
            ref={ref}
        >
            <div className={classNames("inner")}>{popup}</div>
            {showClickPopup ? closeButton : null}
        </div>
    );
};
