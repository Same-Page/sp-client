import React, { useEffect } from "react"
import { connect } from "react-redux"

import storageManager from "storage"
import Tab from "Tab"
import { setAccount } from "redux/actions"
// import { createSocket } from "socket"

function App({ account, setAccount }) {
	useEffect(() => {
		storageManager.addEventListener("account", account => {
			setAccount(account)
		})
		// TODO: get all storage data in one call
		storageManager.get("account", account => {
			setAccount(account)
		})
		// createSocket()
	}, [setAccount])
	return <Tab account={account} />
}

const stateToProps = state => {
	return {
		account: state.account
	}
}
export default connect(stateToProps, {
	setAccount
})(App)
