import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * 选项
     */
    reference.setState(state);
}
const rxSelect = (reference) => (event) => {
    const value = Ux.ambEvent(event);
    if (value) {
        /*
         * 选择了合适的字段信息
         */
        const {$identifier, $inited = {}} = reference.props;
        const params = {};
        params.identifier = $identifier;
        params.key = $inited.key;
        params.field = value;
        reference.setState({$loading: true});
        Ux.ajaxGet("/api/history/:identifier/:key/:field", params).then(items => {
            reference.setState({$data: {items}, $loading: false});
        })
    } else {
        /*
         * 直接清空
         */
        reference.setState({$data: {items: []}});
    }
}
export default {
    yiPage,
    rxSelect,
}