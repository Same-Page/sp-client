import axios from "axios"

import config from "config"
import { buildFormData } from "utils"

export const signup = payload => {
	return axios.post(config.apiUrl + "/api/v1/register", buildFormData(payload))
}
