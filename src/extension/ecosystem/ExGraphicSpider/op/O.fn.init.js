import Ux from 'ux';

export default (reference, state = {}) => {
    const {$current = {}} = reference.props;
    const {$graphic = {}} = state;
    return Ux.ajaxGet('/api/relation/definition/:category', {category: $current.key}).then(response => {
        /*
         * 预处理 data计算 items
         */
        const graphState = Ux.g6GetGraphic(reference, response['relations'], $current, $graphic);
        Object.assign(state, graphState);
        /*
         * 提交必须要使用
         */
        state.$relations = response['relations'];
        return Ux.promise(state);
    })
}