import Ux from 'ux';

export default {
    page: params => Ux.ajaxPost('/api/ui/page', params),

    control: params => Ux.ajaxPost('/api/ui/control', params),

    ops: params => Ux.ajaxPost('/api/ui/ops', params)
}