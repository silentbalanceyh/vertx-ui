import Ux from 'ux';

export default (params = {}) => {
    return Ux.ajaxGet("/api/tag/category/:id", params)
}