import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxPut("/DataAsset/physical-table-column/update", params)
}