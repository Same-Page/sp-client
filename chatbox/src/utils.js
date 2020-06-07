export const getUrl = () => {
	return window.location.hostname + window.location.pathname
}

export const getDomain = () => {
	return window.location.hostname
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
