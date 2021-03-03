import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxGet("/api/tag/id", params)
}