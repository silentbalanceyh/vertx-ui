import Ux from 'ux';

export default {
    page: params => Ux.ajaxPost('/api/ui/page', params)
}