import classNames from "classnames";
import { createElement, useContext, useEffect, useRef, useState } from "react";
import { AssetObject } from "../util/assets";
import { select, event, zoom } from "d3";
import Asset from "./Asset";
import { StoreContext } from "../store";
import Popup from "./Popup";

export interface FloorPlanProps {
    assets: AssetObject[];
    svg: string;
    svgMainID: string;
    viewBox: string;
    className: string;
}

const FloorPlan = ({ svg, svgMainID, viewBox, assets, className }: FloorPlanProps): JSX.Element => {
    const [rendered, setRendered] = useState(false);
    const { state } = useContext(StoreContext);

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<SVGSVGElement | null>(null);
    const mainElementRef = useRef<SVGGElement | null>(null);
    const [zoomTransform, setZoomTransform] = useState("");

    useEffect(() => {
        if (rendered || !backgroundRef.current || !overlayRef.current || !mainElementRef.current) {
            return;
        }

        const background = select(backgroundRef.current);
        const overlay = select(overlayRef.current);

        // background.html(svg);

        const svgElement = background.select("svg");
        const main = svgElement.select(`#${svgMainID}`);

        overlay.call(
            zoom().on("zoom", () => {
                const { x, y, k } = event.transform;
                setZoomTransform(`translate(${x},${y}) scale(${k})`);
                main.attr("transform", event.transform);
            })
        );

        setRendered(true);
    }, [rendered, svg, svgMainID, viewBox]);

    return (
        <div className={classNames("floorPlan", className, { "hover-element": state.hoverElement !== null })}>
            <div className={classNames("floorPlan_bg")} ref={backgroundRef} dangerouslySetInnerHTML={{ __html: svg }} />
            <svg className={classNames("floorPlan_overlay")} ref={overlayRef} viewBox={viewBox}>
                <g ref={mainElementRef} transform={zoomTransform}>
                    {assets.map(asset => (
                        <Asset key={asset.id} asset={asset} overlayElement={overlayRef.current} />
                    ))}
                </g>
            </svg>
            <Popup />
        </div>
    );
};

export default FloorPlan;
