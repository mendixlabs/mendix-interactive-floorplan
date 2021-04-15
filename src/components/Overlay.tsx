import classNames from "classnames";
import { createElement, Fragment, useMemo, useRef } from "react";
import { AssetObject } from "../util/assets";
import Asset from "./Asset";

export interface OverlayProps {
    assets: AssetObject[];
    viewBox: string;
    translation: {
        x: number;
        y: number;
    };
    scale: number;
}

const Overlay = ({ assets, viewBox, translation, scale }: OverlayProps): JSX.Element => {
    const overlayRef = useRef<SVGSVGElement>(null);

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

    return (
        <svg className={classNames("interactive-floorplan--overlay")} ref={overlayRef} viewBox={viewBox}>
            <g transform={`translate(${translation.x},${translation.y}) scale(${scale})`}>{AssetList}</g>
        </svg>
    );
};

export default Overlay;
