import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { useState } from 'preact/hooks';
import styles from "../styles/mainPage.scss"

const MainPage: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  console.log(cfg)
  const [first, setfirst] = useState('second')
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <div class='main-page'>
      {first}
    </div>
  )
}

MainPage.css = styles
export default (() => MainPage) satisfies QuartzComponentConstructor
