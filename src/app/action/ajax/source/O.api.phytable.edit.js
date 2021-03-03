import Fn from "../../../functions";
import Ux from "ux";

export default (params = {}) => {
    const submitted = Fn.outDataTable(params);
    return Ux.ajaxPut("/DataAsset/physical-table/:id", submitted)
}