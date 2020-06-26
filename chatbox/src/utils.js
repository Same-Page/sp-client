// export const getUrl = () => {
// 	return window.location.hostname + window.location.pathname
// }

// export const getDomain = (url) => {
// 	return window.location.hostname
// }

export const getDomain = url => {
	console.debug(url)
	let parsedUrl = ""
	try {
		parsedUrl = new URL(url)
	} catch (error) {
		console.error(error)
		return "unknown"
	}
	return parsedUrl.hostname
}

export const buildFormData = payload => {
	const formData = new FormData()

	Object.keys(payload).forEach(k => {
		if (payload[k]) {
			// don't send null value to backend
			formData.append(k, payload[k])
		}
	})
	return formData
}
