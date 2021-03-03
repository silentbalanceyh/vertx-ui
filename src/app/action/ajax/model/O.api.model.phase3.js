import Ux from "ux";

export default (params) => {
    // API：读取租户信息
    return Ux.ajaxPost("/DataAsset/account/behavior/save", params);
}