import { createElement, ReactNode } from "react";

import { InteractiveFloorplanContainerProps } from "../typings/InteractiveFloorplanProps";
import FloorPlan from "./components/FloorPlan";
import { ContextVariables, FloorPlanContext } from "./context/FloorPlanContext";
import { StateProvider } from "./store";

import "./ui/InteractiveFloorplan.scss";
import { getAssetObjects } from "./util/assets";

const InteractiveFloorplan = (props: InteractiveFloorplanContainerProps): ReactNode => {
    const svgMainID = "main";
    const assets = getAssetObjects(
        {
            getTitle: props.getAssetID,
            getXML: props.getAssetXML,
            getTransform: props.getAssetTransform,
            getShapeStyling: props.getAssetShapeStyling,
            getClickable: props.getAssetClickable,
            getPopupEnabled: props.getAssetShowpopup,
            getClassName: props.getAssetClassName
        },
        !!props.actionClickAsset,
        props.dataAssets.items
    );
    const floorPlanSVG = props.textSVG.value;
    const floorPlanViewBox = props.textSVGViewBox.value;

    const contextVariables: ContextVariables = {
        textSelector: props.uiSelectorText,
        gElementSelector: props.uiSelectorGElement,
        elementClick: props.actionClickAsset ? props.actionClickAsset : null,
        popupArea: props.popupArea ? props.popupArea : null
    };

    return (
        <StateProvider>
            <FloorPlanContext.Provider value={contextVariables}>
                {!floorPlanSVG || !floorPlanViewBox ? (
                    undefined
                ) : (
                    <FloorPlan
                        className={props.class}
                        assets={assets}
                        svg={floorPlanSVG}
                        svgMainID={svgMainID}
                        viewBox={floorPlanViewBox}
                    />
                )}
            </FloorPlanContext.Provider>
        </StateProvider>
    );
};

export default InteractiveFloorplan;
