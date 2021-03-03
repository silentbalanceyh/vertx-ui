import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxPut("/api/tag/update", params)
}