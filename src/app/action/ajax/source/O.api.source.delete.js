import Ux from "ux";

export default (params = {}) => {
    return Ux.ajaxDelete("/DataAsset/data-source/:id", params)
}