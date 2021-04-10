import classNames from "classnames";
import { createElement, CSSProperties, useContext, useMemo } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

const tooltipOffset = {
    x: 15,
    y: -40
};

// type PositionX = "left" | "right";
// type PositionY = "top" | "bottom";

const Popup = (): JSX.Element => {
    const { popupArea } = useContext(FloorPlanContext);
    const { state } = useContext(StoreContext);
    const { hoverCoords, svgSizes } = state;

    const posX = hoverCoords.layerX >= svgSizes.width / 2 ? "right" : "left";
    const posY = hoverCoords.layerY >= svgSizes.height / 2 ? "bottom" : "top";

    const style = useMemo(() => {
        const style: CSSProperties = {};

        if (posX === "left") {
            style.left = hoverCoords.layerX + tooltipOffset.x;
        } else {
            style.right = svgSizes.width - hoverCoords.layerX + tooltipOffset.x;
        }

        if (posY === "top") {
            style.top = hoverCoords.layerY + tooltipOffset.y;
        } else {
            style.bottom = svgSizes.height - hoverCoords.layerY + tooltipOffset.y;
        }
        return style;
    }, [posX, posY, hoverCoords.layerX, hoverCoords.layerY, svgSizes.width, svgSizes.height]);

    if (popupArea !== null && state.showPopup && state.hoverElement !== null && hoverCoords) {
        const popup = popupArea(state.hoverElement);

        return (
            <div style={style} className={classNames("tooltip", posX, posY)}>
                <div className={classNames("inner")}>{popup}</div>
            </div>
        );
    }

    return <div className={classNames("tooltip", "hide")} />;
};

export default Popup;
