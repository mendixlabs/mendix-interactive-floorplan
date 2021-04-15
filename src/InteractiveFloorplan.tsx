import "./wdyr";

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
        getAssetShowHoverPopup,
        getAssetShowClickPopup,
        getAssetTransform,
        getAssetClassName,
        getAssetShapeStyling,
        uiMainSelectorG,
        uiSelectorGElement,
        uiSelectorText,
        popupHoverArea,
        popupClickArea
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
                    getHoverPopupEnabled: getAssetShowHoverPopup,
                    getClickPopupEnabled: getAssetShowClickPopup,
                    getClassName: getAssetClassName
                },
                !!actionClickAsset || !!popupClickArea,
                props.dataAssets.items
            ),
        [
            actionClickAsset,
            popupClickArea,
            getAssetClassName,
            getAssetClickable,
            getAssetID,
            getAssetShapeStyling,
            getAssetShowHoverPopup,
            getAssetShowClickPopup,
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

    const getHoverPopupContent = useCallback(
        (id: string): ReactNode => {
            if (!id || !popupHoverArea) {
                return null;
            }
            const object = dataAssets.items?.find(obj => obj.id === id);
            if (object) {
                return popupHoverArea(object);
            }
            return null;
        },
        [popupHoverArea, dataAssets.items]
    );

    const getClickPopupContent = useCallback(
        (id: string): ReactNode => {
            if (!id || !popupClickArea) {
                return null;
            }
            const object = dataAssets.items?.find(obj => obj.id === id);
            if (object) {
                return popupClickArea(object);
            }
            return null;
        },
        [popupClickArea, dataAssets.items]
    );

    const contextVariables: ContextVariables = useMemo(
        () => ({
            textSelector: uiSelectorText,
            gElementSelector: uiSelectorGElement,
            mainSelector: uiMainSelectorG,
            onItemClick,
            getHoverPopupContent,
            getClickPopupContent
        }),
        [uiSelectorText, uiSelectorGElement, uiMainSelectorG, onItemClick, getHoverPopupContent, getClickPopupContent]
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
