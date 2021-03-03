import Fn from "../../../functions";
import Ux from "ux";

export default (params = {}) => {
    const submitted = Fn.outDataSource(params);
    return Ux.ajaxPut("/DataAsset/data-source/:id", submitted)
}