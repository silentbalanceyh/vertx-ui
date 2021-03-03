import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxGet("/api/task/view/:id", params)
}