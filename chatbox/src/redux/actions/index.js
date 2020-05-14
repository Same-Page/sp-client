export const setAccount = account => ({
	type: "SET_ACCOUNT",
	payload: account
})

export const setActiveTab = activeTab => ({
	type: "CHANGE_TAB",
	payload: activeTab
})

export const messageUser = user => ({
	type: "MESSAGE_USER",
	payload: user
})

export const setInboxUser = user => ({
	type: "SET_INBOX_USER",
	payload: user
})
