import Ux from 'ux';

export default (params = {}) => {
    return Ux.ajaxDelete("/api/tag/category", params)
}