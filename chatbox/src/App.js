import React, { useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"
import axios from "axios"

import storageManager from "storage"
import Tab from "Tab"
import { setAccount } from "redux/actions"

require("moment/locale/zh-cn") //moment.js bug, has to manually include

const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

function App({ account, setAccount }) {
	useEffect(() => {
		storageManager.addEventListener("account", account => {
			setAccount(account)
		})
		// TODO: get all storage data in one call
		storageManager.get("account", account => {
			setAccount(account)
		})
	}, [setAccount])
	useEffect(() => {
		if (account) {
			console.info("account id changed to " + account.id)
			axios.defaults.headers.common["token"] = account.token
		}
	}, [account])
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
