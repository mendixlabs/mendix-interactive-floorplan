// import "./wdyr";

import { createElement, ReactNode, useCallback, useMemo } from "react";

import { InteractiveFloorplanContainerProps } from "../typings/InteractiveFloorplanProps";
import FloorPlan from "./components/FloorPlan";
import { ContextVariables, FloorPlanContext } from "./context/FloorPlanContext";
import { StateProvider } from "./store";

import "./ui/InteractiveFloorplan.scss";
import { executeAction, getPopupContent } from "./util";
import { getAssetObjects } from "./util/assets";

const InteractiveFloorplan = (props: InteractiveFloorplanContainerProps): ReactNode => {
    const {
        dataAssets,
        actionClickAsset,
        actionOnCloseClickPopup,
        showPageOverlayOnClickPopup,
        uiMainSelectorG,
        uiSelectorGElement,
        uiSelectorText,
        popupHoverArea,
        popupClickArea,
        hoverPopupClassName,
        clickPopupClassName,
        popupOffsetJSON
    } = props;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const assets = useMemo(() => getAssetObjects(props), [props.dataAssets.items]);

    const floorPlanSVG = props.textSVG.value;
    const autoDetermineViewBox = props.textSVGViewBox === undefined;
    const floorPlanViewBox = props.textSVGViewBox ? (props.textSVGViewBox.value as string) : null;

    const onItemClick = useCallback((id: string): void => executeAction(id, dataAssets.items, actionClickAsset), [
        actionClickAsset,
        dataAssets.items
    ]);

    const onClosePopup = useCallback(
        (id?: string): void => executeAction(id, dataAssets.items, actionOnCloseClickPopup),
        [actionOnCloseClickPopup, dataAssets.items]
    );

    const getHoverPopupContent = useCallback(
        (id: string) => getPopupContent(id, dataAssets.items, popupHoverArea, hoverPopupClassName, popupOffsetJSON),
        [dataAssets.items, popupHoverArea, hoverPopupClassName, popupOffsetJSON]
    );

    const getClickPopupContent = useCallback(
        (id: string) => getPopupContent(id, dataAssets.items, popupClickArea, clickPopupClassName, popupOffsetJSON),
        [dataAssets.items, popupClickArea, clickPopupClassName, popupOffsetJSON]
    );

    const contextVariables: ContextVariables = useMemo(
        () => ({
            textSelector: uiSelectorText,
            gElementSelector: uiSelectorGElement,
            mainSelector: uiMainSelectorG,
            showPageOverlayOnClickPopup,
            autoDetermineViewBox,
            onItemClick,
            onClosePopup,
            getHoverPopupContent,
            getClickPopupContent
        }),
        [
            uiSelectorText,
            uiSelectorGElement,
            uiMainSelectorG,
            showPageOverlayOnClickPopup,
            autoDetermineViewBox,
            onItemClick,
            onClosePopup,
            getHoverPopupContent,
            getClickPopupContent
        ]
    );

    return (
        <StateProvider initialState={{ viewBox: floorPlanViewBox }}>
            <FloorPlanContext.Provider value={contextVariables}>
                {!floorPlanSVG ? undefined : <FloorPlan className={props.class} assets={assets} svg={floorPlanSVG} />}
            </FloorPlanContext.Provider>
        </StateProvider>
    );
};

export default InteractiveFloorplan;
