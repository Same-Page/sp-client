import React, { useState } from "react"

import Profile from "components/Profile"
import Login from "./Login"
import Signup from "./Signup"
import AccountButtons from "./AccountButtons"

function Account({ account }) {
	const [signup, setSignup] = useState(false)
	if (account) {
		return (
			<div style={{ width: 250, margin: "auto", marginTop: 50 }}>
				<Profile user={account} />
				<AccountButtons />
			</div>
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
