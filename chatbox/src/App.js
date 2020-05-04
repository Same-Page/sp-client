import React, { useEffect } from "react"
import { connect } from "react-redux"

import storageManager from "storage"
import Tab from "Tab"
import { setAccount } from "redux/actions"

function App({ setAccount }) {
	useEffect(() => {
		storageManager.addEventListener("account", account => {
			setAccount(account)
		})
		storageManager.get("account", account => {
			setAccount(account)
		})
	}, [])
	return <Tab />
}

const stateToProps = state => {
	return {
		account: state.account
	}
}
export default connect(stateToProps, {
	setAccount
})(App)
