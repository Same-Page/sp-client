import axios from "axios"

const initState = {
	account: null,
	activeTab: "comment",
	inboxUser: null
}

const store = (state = initState, action) => {
	switch (action.type) {
		case "SET_ACCOUNT":
			const account = action.payload
			if (account) {
				axios.defaults.headers.common["token"] = account.token
			} else {
				// socketManager.disconnect()  no need, injection script listen on account change too
			}

			return {
				...state,
				account: account
			}
		case "CHANGE_TAB":
			return {
				...state,
				activeTab: action.payload
			}
		case "MESSAGE_USER":
			return {
				...state,
				activeTab: "inbox",
				inboxUser: action.payload
			}
		case "SET_INBOX_USER":
			return {
				...state,
				inboxUser: action.payload
			}
		default:
			return state
	}
}

export default store
