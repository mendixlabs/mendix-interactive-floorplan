// import "./wdyr";

import { createElement, ReactNode, useCallback, useMemo } from "react";

import { InteractiveFloorplanContainerProps } from "../typings/InteractiveFloorplanProps";
import FloorPlan from "./components/FloorPlan";
import { ContextVariables, FloorPlanContext } from "./context/FloorPlanContext";
import { StateProvider } from "./store";

import "./ui/InteractiveFloorplan.scss";
import { getAssetObjects } from "./util/assets";

const InteractiveFloorplan = (props: InteractiveFloorplanContainerProps): ReactNode => {
    const {
        dataAssets,
        actionClickAsset,
        getAssetID,
        getAssetXML,
        getAssetClickable,
        getAssetShowpopup,
        getAssetTransform,
        getAssetClassName,
        getAssetShapeStyling,
        uiMainSelectorG,
        uiSelectorGElement,
        uiSelectorText,
        popupArea
    } = props;

    const assets = useMemo(
        () =>
            getAssetObjects(
                {
                    getTitle: getAssetID,
                    getXML: getAssetXML,
                    getTransform: getAssetTransform,
                    getShapeStyling: getAssetShapeStyling,
                    getClickable: getAssetClickable,
                    getPopupEnabled: getAssetShowpopup,
                    getClassName: getAssetClassName
                },
                !!actionClickAsset,
                props.dataAssets.items
            ),
        [
            actionClickAsset,
            getAssetClassName,
            getAssetClickable,
            getAssetID,
            getAssetShapeStyling,
            getAssetShowpopup,
            getAssetTransform,
            getAssetXML,
            props.dataAssets.items
        ]
    );

    const floorPlanSVG = props.textSVG.value;
    const floorPlanViewBox = props.textSVGViewBox.value;

    const onItemClick = useCallback(
        (id: string): void => {
            const object = dataAssets.items?.find(obj => obj.id === id);

            if (object && actionClickAsset) {
                const action = actionClickAsset(object);
                if (action && action.canExecute && !action.isExecuting) {
                    action.execute();
                }
            }
        },
        [actionClickAsset, dataAssets.items]
    );

    const getPopupContent = useCallback(
        (id: string): ReactNode => {
            if (!id || !popupArea) {
                return null;
            }
            const object = dataAssets.items?.find(obj => obj.id === id);
            if (object) {
                return popupArea(object);
            }
            return null;
        },
        [popupArea, dataAssets.items]
    );

    const contextVariables: ContextVariables = useMemo(
        () => ({
            textSelector: uiSelectorText,
            gElementSelector: uiSelectorGElement,
            mainSelector: uiMainSelectorG,
            onItemClick,
            getPopupContent
        }),
        [uiSelectorText, uiSelectorGElement, uiMainSelectorG, onItemClick, getPopupContent]
    );

    return (
        <StateProvider>
            <FloorPlanContext.Provider value={contextVariables}>
                {!floorPlanSVG || !floorPlanViewBox ? (
                    undefined
                ) : (
                    <FloorPlan className={props.class} assets={assets} svg={floorPlanSVG} viewBox={floorPlanViewBox} />
                )}
            </FloorPlanContext.Provider>
        </StateProvider>
    );
};

export default InteractiveFloorplan;
