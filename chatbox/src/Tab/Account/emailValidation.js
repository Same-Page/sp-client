import axios from "axios"
import { message } from "antd"

import config from "config"

export const checkEmailNotRegistered = async email => {
	const payload = {
		email: email
	}

	try {
		const resp = await axios.post(
			config.apiUrl + "/api/v1/user/check_email_registered",
			payload
		)
		const registered = resp.data.registered
		if (!registered) return Promise.resolve()
		else return Promise.reject("该邮箱地址已经被注册了!")
	} catch (error) {
		message.error("无法检查邮箱!")
		console.error(error)
		Promise.reject("无法检查邮箱!")
	}
	return Promise.reject("检查邮箱出错了!")
}
