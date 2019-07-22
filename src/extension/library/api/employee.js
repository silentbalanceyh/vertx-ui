import Ux from 'ux';

export default {
    user: () => Ux.ajaxGet(`/api/user`)
}