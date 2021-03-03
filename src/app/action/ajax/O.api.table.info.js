import Ux from 'ux';
import Cv from "./O.fn.constant";

export default (params = {}) => {
    const {dataSourceId} = params;
    if (dataSourceId) {
        const user = Ux.isLogged();
        const companyCode = user['companyCode'];
        return Ux.ajaxGet("/DataAsset/data-source/physical-table/:dataSourceId/:companyCode", {
            companyCode,
            dataSourceId,
        }, Cv.OPTIONS).then(response => {
            console.info(response);
            return Ux.promise({});
        })
    } else return Ux.promise({});
}