import classNames from "classnames";
import { createElement, CSSProperties, useContext } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

const tooltipOffset = {
    x: 15,
    y: -40
};

const Popup = (): JSX.Element => {
    const { popupArea } = useContext(FloorPlanContext);
    const { state } = useContext(StoreContext);
    const { hoverCoords } = state;

    if (popupArea !== null && state.showPopup && state.hoverElement !== null && hoverCoords) {
        const popup = popupArea(state.hoverElement);

        const style: CSSProperties = {};

        if (hoverCoords.posX === "left") {
            style.left = hoverCoords.layerX + tooltipOffset.x;
        } else {
            style.right = hoverCoords.width - hoverCoords.layerX + tooltipOffset.x;
        }

        if (hoverCoords.posY === "top") {
            style.top = hoverCoords.layerY + tooltipOffset.y;
        } else {
            style.bottom = hoverCoords.height - hoverCoords.layerY + tooltipOffset.y;
        }

        return (
            <div style={style} className={classNames("tooltip", hoverCoords.posX, hoverCoords.posY)}>
                <div className={classNames("inner")}>{popup}</div>
            </div>
        );
    }

    return <div className={classNames("tooltip", "hide")} />;
};

export default Popup;
