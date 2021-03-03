import Fn from "../../../functions";
import Ux from "ux";

export default (params = {}) => {
    const submitted = Fn.outSyncTable(params);
    return Ux.ajaxPost("/DataAsset/data-source/sync-physical-table", submitted)
}