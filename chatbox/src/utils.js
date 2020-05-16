export const getUrl = () => {
	return window.location.href
}

export const getDomain = () => {
	const url = getUrl()
	let parsedUrl = ""
	try {
		parsedUrl = new URL(url)
	} catch (error) {
		console.error(error)
		return "unknown"
	}
	return parsedUrl.hostname
}

export const url = getUrl()

export const domain = getDomain()
