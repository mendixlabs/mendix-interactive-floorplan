declare module "react-map-interaction" {
    type InteractionState = {
      scale: number
      translation: { x: number; y: number }
    }
    type Props = {
      showControls?: boolean
      minScale?: number
      maxScale?: number
      value?: InteractionState
      onChange?: (state: InteractionState) => void
    }
    export const MapInteractionCSS: import("react").ComponentType<Props>
    export const MapInteraction: import("react").ComponentType<
      Props & {
        children: (params: InteractionState) => React.ReactNode
      }
    >
}
