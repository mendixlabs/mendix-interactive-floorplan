import classNames from "classnames";
import { createElement, Fragment, useContext, useMemo, useRef, useEffect } from "react";
import { AssetObject } from "../util/assets";
import { HoverPopup } from "./Popup";
import { MapInteraction } from "react-map-interaction";
import Background from "./Background";
import { useSize, useThrottleEffect } from "ahooks";
import { StoreContext } from "../store";
import Asset from "./Asset";

export interface FloorPlanProps {
    assets: AssetObject[];
    svg: string;
    viewBox: string;
    className: string;
}

const FloorPlan = ({ svg, viewBox, assets, className }: FloorPlanProps): JSX.Element => {
    const { dispatch, state } = useContext(StoreContext);
    const planRef = useRef<HTMLDivElement>(null);

    const size = useSize(planRef);

    useThrottleEffect(
        () => {
            if (size.width !== undefined && size.height !== undefined) {
                dispatch({ type: "SETSIZE", width: size.width, height: size.height });
            }
        },
        [size],
        {
            wait: 1000,
            leading: false
        }
    );

    useEffect(() => {
        if (!(window as any)["com.mendix.InteractiveFloorplan.closePopup"]) {
            (window as any).com = (window as any).com || {};
            (window as any).com.mendix = (window as any).com.mendix || {};
            (window as any).com.mendix.InteractiveFloorplan = (window as any).com.mendix.InteractiveFloorplan || {};
            (window as any).com.mendix.InteractiveFloorplan.closePopup = () => {
                dispatch({ type: "CLICKED", id: null, popup: false });
            };
        }

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            (window as any).com.mendix.InteractiveFloorplan.closePopup = () => {};
        };
    }, []);

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
                        <svg className={classNames("interactive-floorplan--overlay")} viewBox={viewBox}>
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
        <div
            className={classNames("interactive-floorplan", className, { "interaction-disabled": state.showClickPopup })}
            ref={planRef}
        >
            {Main}
            <HoverPopup />
        </div>
    );
};

FloorPlan.whyDidYouRender = true;

export default FloorPlan;
