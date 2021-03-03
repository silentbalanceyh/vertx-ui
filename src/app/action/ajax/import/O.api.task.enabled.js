import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxPut("/api/task/enabled/:id", params)
}