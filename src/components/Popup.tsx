import classNames from "classnames";
import { createElement, CSSProperties, useContext, useMemo } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

const tooltipOffset = {
    x: 15,
    y: -40
};

const Popup = (): JSX.Element => {
    const { getPopupContent } = useContext(FloorPlanContext);
    const { state } = useContext(StoreContext);
    const { hoverCoords, svgSizes, hoverElement } = state;

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

    if (state.showPopup && hoverElement !== null && hoverCoords) {
        const popup = getPopupContent(hoverElement);

        return (
            <div style={style} className={classNames("tooltip", "interactive-floorplan--tooltip", posX, posY)}>
                <div className={classNames("inner")}>{popup}</div>
            </div>
        );
    }

    return <div className={classNames("tooltip", "hide")} />;
};

export default Popup;
