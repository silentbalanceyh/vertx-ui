import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxPost("/api/tag/search/by", params)
}