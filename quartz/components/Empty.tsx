import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const EmptyComponent: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return null
}

EmptyComponent.css = ``

export default (() => EmptyComponent) satisfies QuartzComponentConstructor