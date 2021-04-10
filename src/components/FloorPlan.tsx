import classNames from "classnames";
import { createElement, useContext, useRef } from "react";
import { AssetObject } from "../util/assets";
// import { select, event, zoom } from "d3";
import Asset from "./Asset";
import { StoreContext } from "../store";
import Popup from "./Popup";
import { MapInteraction } from "react-map-interaction";
import Background from "./Background";

export interface FloorPlanProps {
    assets: AssetObject[];
    svg: string;
    viewBox: string;
    className: string;
}

const FloorPlan = ({ svg, viewBox, assets, className }: FloorPlanProps): JSX.Element => {
    const { state } = useContext(StoreContext);

    const overlayRef = useRef<SVGSVGElement | null>(null);
    const mainElementRef = useRef<SVGGElement | null>(null);

    return (
        <div
            className={classNames("interactive-floorplan", className, { "hover-element": state.hoverElement !== null })}
        >
            <MapInteraction maxScale={6} minScale={0.6}>
                {({ translation, scale }) => (
                    <div>
                        <Background svg={svg} x={translation.x} y={translation.y} scale={scale} />
                        <svg
                            className={classNames("interactive-floorplan--overlay")}
                            ref={overlayRef}
                            viewBox={viewBox}
                        >
                            <g
                                ref={mainElementRef}
                                transform={`translate(${translation.x},${translation.y}) scale(${scale})`}
                            >
                                {assets.map(asset => (
                                    <Asset key={asset.id} asset={asset} overlayElement={overlayRef.current} />
                                ))}
                            </g>
                        </svg>
                    </div>
                )}
            </MapInteraction>
            <Popup />
        </div>
    );
};

export default FloorPlan;
