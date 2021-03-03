import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxDelete("/DataAsset/physical-table/:id", params)
}