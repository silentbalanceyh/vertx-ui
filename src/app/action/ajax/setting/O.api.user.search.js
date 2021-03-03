import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxPost("/api/user/search", params)
}