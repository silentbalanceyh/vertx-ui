import Ux from 'ux';

export default (params) => {
    // TODO: API-Menu 数据源列表读取
    return Ux.ajaxPost("/api/source/tables", params);
}