import Ux from 'ux';

export default {
    form: (params) => Ux.ajaxPost(`/api/app/:appId/form/:control`, params)
}