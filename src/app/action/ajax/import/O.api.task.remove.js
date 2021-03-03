import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxDelete("/api/task/remove/:id", params)
}