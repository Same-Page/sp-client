import { createStore } from "redux"
import rootReducer from "redux/reducers"
const store = createStore(rootReducer)
window.spStore = store
export default store
