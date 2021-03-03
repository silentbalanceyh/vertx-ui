import Fn from '../../../functions';
import Ux from "ux";
import Cv from "../O.fn.constant";

export default (params = {}) => {
    const submitted = Fn.outDataSource(params);
    return Ux.ajaxGet("/DataAsset/data-source/check",
        submitted, Cv.OPTIONS)
}