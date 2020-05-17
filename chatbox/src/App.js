import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"
import axios from "axios"

import storageManager from "storage"
import Tab from "Tab"
import { setAccount, setActiveTab } from "redux/actions"

require("moment/locale/zh-cn") //moment.js bug, has to manually include

const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

function App({ account, setAccount, activeTab, setActiveTab }) {
	// wait for localStorage finish loading before rendering anything
	// ready can only change from false to true for one time!
	const [ready, setReady] = useState(false)
	const [storageData, setStorageData] = useState()
	useEffect(() => {
		// Load everything from localStorage
		// register all localstorage listeners
		storageManager.addEventListener("account", account => {
			setAccount(account)
		})
		// pass null as storage key to get all stored data
		storageManager.get(null, data => {
			setStorageData(data)
			if (data.account) {
				setAccount(data.account)
			}
		})

		setReady(true)
	}, [setAccount])

	useEffect(() => {
		if (account) {
			console.info("account id changed to " + account.id)
			axios.defaults.headers.common["token"] = account.token
		}
	}, [account])

	return (
		<div className="sp-all">
			{ready && (
				<Tab
					storageData={storageData}
					account={account}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
			)}
		</div>
	)
}

const stateToProps = state => {
	return {
		account: state.account,
		activeTab: state.activeTab
	}
}
export default connect(stateToProps, {
	setAccount,
	setActiveTab
})(App)
