import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxGet("/DataAsset/physical-table/get", params)
}