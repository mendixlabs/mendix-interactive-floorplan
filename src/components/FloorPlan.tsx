import classNames from "classnames";
import { createElement, Fragment, useContext, useMemo, useRef, useEffect } from "react";
import { AssetObject } from "../util/assets";
import { ClickPopup, HoverPopup } from "./Popup";
import { MapInteraction } from "react-map-interaction";
import Background from "./Background";
import { useSize, useThrottleEffect } from "ahooks";
import { StoreContext } from "../store";
import Asset from "./Asset";

export interface FloorPlanProps {
    assets: AssetObject[];
    svg: string;
    className: string;
}

const FloorPlan = ({ svg, assets, className }: FloorPlanProps): JSX.Element => {
    const { dispatch, state } = useContext(StoreContext);
    const { viewBox } = state;

    const planRef = useRef<HTMLDivElement>(null);
    const size = useSize(planRef);

    useThrottleEffect(
        () => {
            if (size.width !== undefined && size.height !== undefined && planRef.current) {
                const rect = planRef.current.getBoundingClientRect();
                dispatch({ type: "SETSIZE", width: size.width, height: size.height, rect });
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
            (window as any).com.mendix.InteractiveFloorplan.closePopup = (triggerAction = true) => {
                dispatch({ type: "CLICKED", id: null, popup: false });
                console.log(triggerAction);
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
                        {viewBox ? (
                            <svg className={classNames("interactive-floorplan--overlay")} viewBox={viewBox}>
                                <g transform={`translate(${translation.x},${translation.y}) scale(${scale})`}>
                                    {AssetList}
                                </g>
                            </svg>
                        ) : null}
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
            <ClickPopup />
        </div>
    );
};

// FloorPlan.whyDidYouRender = true;

export default FloorPlan;
