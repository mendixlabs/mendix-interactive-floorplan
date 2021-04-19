import { createElement, CSSProperties, Fragment, useContext, useMemo, useRef } from "react";
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
    const { getHoverPopupContent } = useContext(FloorPlanContext);
    const { state } = useContext(StoreContext);
    const { hoverCoords, svgSizes, selectedHoverItem, showHoverPopup } = state;
    const { style, positionX, positionY } = useMemo(() => getPositionStyle(svgSizes, hoverCoords), [
        svgSizes,
        hoverCoords
    ]);
    const showPopup = selectedHoverItem !== null && !!hoverCoords && showHoverPopup;

    if (!showPopup) {
        return <Fragment />;
    }

    const popup = selectedHoverItem !== null && showHoverPopup ? getHoverPopupContent(selectedHoverItem) : null;
    const popupType = selectedHoverItem !== null && showHoverPopup ? "hover" : null;

    return (
        <Fragment>
            <div
                className={classNames(
                    "tooltip",
                    "interactive-floorplan--tooltip",
                    {
                        hide: !showPopup,
                        "type--hover": popupType === "hover"
                    },
                    positionX,
                    positionY
                )}
                style={showPopup ? style : {}}
            >
                <div className={classNames("inner")}>{popup}</div>
            </div>
        </Fragment>
    );
};

export const ClickPopup = (): JSX.Element => {
    const { getClickPopupContent, showPageOverlayOnClickPopup } = useContext(FloorPlanContext);
    const ref = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useContext(StoreContext);
    const { clickCoords, svgSizes, selectedClickItem: selectedItem, showClickPopup } = state;
    const showPopup = selectedItem !== null && !!clickCoords;

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

    const popup = selectedItem !== null && showClickPopup ? getClickPopupContent(selectedItem) : null;
    const popupType = selectedItem !== null && showClickPopup ? "click" : null;
    const { style, positionX, positionY } = useMemo(() => getPositionStyle(svgSizes, clickCoords), [
        svgSizes,
        clickCoords
    ]);
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
        <Fragment>
            {showPopup && popupType === "click" && showPageOverlayOnClickPopup ? (
                <div className={classNames("interactive-floorplan--pageoverlay")} />
            ) : null}
            <div
                className={classNames(
                    "tooltip",
                    "interactive-floorplan--tooltip",
                    {
                        hide: !showPopup,
                        "type--click": popupType !== null
                    },
                    positionX,
                    positionY
                )}
                style={showPopup ? style : {}}
                ref={ref}
            >
                <div className={classNames("inner")}>{popup}</div>
                {showClickPopup ? closeButton : null}
            </div>
        </Fragment>
    );
};
