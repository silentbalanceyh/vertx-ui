import Ux from 'ux';

export default (params) => {
    // TODO: API-Menu 数据源列表读取
    return Ux.ajaxGet("/api/source/:key", params);
    /*
    return Ux.ajaxPost('/DataAsset/show-database',{},Cv.OPTIONS).then(response => {
        console.info(response);
        return Ux.promise([]);
    })*/
}