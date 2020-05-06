import React, { useState } from "react"

import Profile from "Tab/Profile"
import Login from "./Login"
import Signup from "./Signup"
import AccountButtons from "./AccountButtons"

function Account({ account }) {
	const [signup, setSignup] = useState(false)
	if (account) {
		return (
			<>
				<div style={{ marginTop: 50 }}></div>
				<Profile user={account} />
				<AccountButtons />
			</>
		)
	}

	if (signup) {
		return (
			<Signup
				login={() => {
					setSignup(false)
				}}
			/>
		)
	}

	return (
		<Login
			signup={() => {
				setSignup(true)
			}}
		/>
	)
}

export default Account
