import Ux from "ux";

export default (params = {}) => {
    const request = {};
    request.key = params.key;
    return Ux.ajaxPut("/api/user/:key/re-generate", request)
}