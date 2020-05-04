import React, { useState } from "react"
import { connect } from "react-redux"

import Profile from "Tab/Profile"
import Login from "./Login"
import Signup from "./Signup"
import AccountButtons from "./AccountButtons"

function Account({ account }) {
	const [signup, setSignup] = useState(false)
	if (account) {
		return (
			<>
				<Profile account={account} />
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

const stateToProps = state => {
	return {
		account: state.account
	}
}
export default connect(stateToProps)(Account)
