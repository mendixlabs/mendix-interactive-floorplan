import classNames from "classnames";
import { $, attr } from "dom7";
import { createElement, useContext, useLayoutEffect, useMemo, useRef } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";
import { StoreContext } from "../store";

$.fn.attr = attr;
interface BackgroundProps {
    svg: string;
    x: number;
    y: number;
    scale: number;
}

const Background = ({ svg, x, y, scale }: BackgroundProps): JSX.Element => {
    const { dispatch } = useContext(StoreContext);
    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const { mainSelector, autoDetermineViewBox } = useContext(FloorPlanContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const main = useMemo(() => $(`svg ${mainSelector}`, backgroundRef.current as HTMLDivElement), [
        mainSelector,
        backgroundRef.current
    ]);

    useLayoutEffect(() => {
        const svg = $("svg", backgroundRef.current as HTMLDivElement);
        const viewBox = svg ? svg.attr("viewBox") : null;
        if (svg && viewBox !== null && autoDetermineViewBox) {
            dispatch({ type: "VIEWBOX", viewBox });
        }
    }, [mainSelector, autoDetermineViewBox, dispatch]);

    main.attr("transform", `translate(${x},${y}) scale(${scale})`);

    return (
        <div
            className={classNames("interactive-floorplan--background")}
            ref={backgroundRef}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default Background;
