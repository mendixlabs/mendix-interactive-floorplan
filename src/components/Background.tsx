import classNames from "classnames";
import { $, attr } from "dom7";
import { createElement, useContext, useMemo, useRef } from "react";
import { FloorPlanContext } from "../context/FloorPlanContext";

$.fn.attr = attr;
interface BackgroundProps {
    svg: string;
    x: number;
    y: number;
    scale: number;
}

const Background = ({ svg, x, y, scale }: BackgroundProps): JSX.Element => {
    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const { mainSelector } = useContext(FloorPlanContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const main = useMemo(() => $(`svg ${mainSelector}`, backgroundRef.current as HTMLDivElement), [
        mainSelector,
        backgroundRef.current
    ]);

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
