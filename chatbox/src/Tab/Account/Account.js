import React, { useState, useEffect } from "react"

import Login from "./Login"
import Signup from "./Signup"
import Overview from "./Overview"

function Account({ account, storageData }) {
	const [view, setView] = useState("overview")
	const token = account && account.token
	useEffect(() => {
		if (token) {
			setView("overview")
		} else {
			setView("login")
		}
	}, [token])
	return (
		<>
			{view === "overview" && account && (
				<Overview storageData={storageData} account={account} />
			)}
			{view === "login" && (
				<Login
					signup={() => {
						setView("signup")
					}}
				/>
			)}
			{view === "signup" && (
				<Signup
					login={() => {
						setView("login")
					}}
				/>
			)}
		</>
	)
}

export default Account
