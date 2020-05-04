import axios from "axios"

const initState = {}

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
				account: account,
			}

		default:
			return state
	}
}

export default store
