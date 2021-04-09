import classNames from "classnames";
import { createElement, useEffect, useRef, useState } from "react";
import { AssetObject } from "../util/assets";
import { select, event, zoom } from "d3";
import Asset from "./Asset";

export interface FloorPlanProps {
    assets: AssetObject[];
    svg: string;
    svgMainID: string;
    viewBox: string;
}

const FloorPlan = ({ svg, svgMainID, viewBox, assets }: FloorPlanProps): JSX.Element => {
    const [rendered, setRendered] = useState(false);

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const mainElementRef = useRef<SVGGElement | null>(null);
    const [zoomTransform, setZoomTransform] = useState("");

    useEffect(() => {
        if (rendered || !backgroundRef.current || !overlayRef.current || !mainElementRef.current) {
            return;
        }

        const background = select(backgroundRef.current);
        const overlay = select(overlayRef.current);

        background.html(svg);

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
    }, [rendered, svg, viewBox]);


    return (
        <div className={classNames("floorPlan")}>
            <div className={classNames("floorPlan_bg")} ref={backgroundRef} />
            <svg className={classNames("floorPlan_overlay")} ref={overlayRef} viewBox={viewBox}>
                <g ref={mainElementRef} transform={zoomTransform}>
                    {assets.map((asset) => (
                        <Asset key={asset.id} asset={asset} />
                    ))}
                </g>
            </svg>
            <div className={classNames("tooltip", "hide")} ref={tooltipRef} />
        </div>
    );
};

export default FloorPlan;
