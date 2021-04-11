import classNames from "classnames";
import { createElement, Fragment, useContext, useEffect, useMemo, useRef } from "react";
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
    const { dispatch } = useContext(StoreContext);

    const overlayRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (overlayRef.current) {
            const box = overlayRef.current.getBoundingClientRect();
            if (box) {
                dispatch({ type: "SETSIZE", width: box.width, height: box.height });
            }
        }
    }, [dispatch]);

    const AssetList = useMemo(
        () => (
            <Fragment>
                {assets.map(asset => (
                    <Asset key={asset.id} {...asset} />
                ))}
            </Fragment>
        ),
        [assets]
    );

    const Main = useMemo(
        () => (
            <MapInteraction maxScale={6} minScale={0.6}>
                {({ translation, scale }) => (
                    <div>
                        <Background svg={svg} x={translation.x} y={translation.y} scale={scale} />
                        <svg
                            className={classNames("interactive-floorplan--overlay")}
                            ref={overlayRef}
                            viewBox={viewBox}
                        >
                            <g transform={`translate(${translation.x},${translation.y}) scale(${scale})`}>
                                {AssetList}
                            </g>
                        </svg>
                    </div>
                )}
            </MapInteraction>
        ),
        [AssetList, svg, viewBox]
    );

    return (
        <div className={classNames("interactive-floorplan", className)}>
            {Main}
            <Popup />
        </div>
    );
};

export default FloorPlan;
