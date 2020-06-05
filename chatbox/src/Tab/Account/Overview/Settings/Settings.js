import React, { useState } from "react"
import { Button } from "antd"
import { LeftOutlined, SaveOutlined } from "@ant-design/icons"

import Header from "components/Header"

// import { changePassword } from "./service"

function ChangePassword({ back }) {
	const [loading, setLoading] = useState(false)

	const onFinish = async values => {
		console.debug("Received values of form: ", values)
		setLoading(true)

		// try {
		// 	const resp = await changePassword(values)

		// 	message.success("密码更新成功！")
		// } catch (error) {
		// 	message.error("密码更新失败！")
		// 	console.error(error)
		// }
		// setLoading(false)
	}

	return (
		<>
			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems="设置"
			/>
		</>
	)
}

export default ChangePassword
