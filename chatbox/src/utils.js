export const getUrl = () => {
	return window.location.hostname + window.location.pathname
}

export const getDomain = () => {
	return window.location.hostname
}

export const url = getUrl()

export const domain = getDomain()
