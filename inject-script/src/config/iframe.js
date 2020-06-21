import spConfig from "config"

// TODO: chrome extension popup.html should be able to set this
export const createIframeByDefault = false

const iframeSrc = spConfig.chatboxSrc
export { iframeSrc }

// mimic iframe control
export const showIframeControl =
	window.location.href.indexOf("localhost:3210") > -1

export const defaultIframeSize = {
	width: 400,
	height: 600,
	minWidth: 350,
	minHeight: 350,
}
