import Fn from "../../../functions";
import Ux from "ux";

export default (params = {}) => {
    const submitted = Fn.outDataSource(params);
    return Ux.ajaxPost("/DataAsset/data-source/add", submitted)
}