import classNames from "classnames";
import { createElement, CSSProperties, useContext } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

const tooltipOffset = {
    x: 10,
    y: -40
};

const Popup = (): JSX.Element => {
    const { popupArea } = useContext(FloorPlanContext);
    const { state } = useContext(StoreContext);

    if (popupArea !== null && state.showPopup && state.hoverElement !== null && state.hoverCoords) {
        const popup = popupArea(state.hoverElement);
        const style: CSSProperties = {
            left: state.hoverCoords.layerX + tooltipOffset.x,
            top: state.hoverCoords.layerY + tooltipOffset.y
        };
        return (
            <div style={style} className={classNames("tooltip")}>
                <div className={classNames("inner")}>{popup}</div>
            </div>
        );
    }

    return <div className={classNames("tooltip", "hide")} />;
};

export default Popup;
