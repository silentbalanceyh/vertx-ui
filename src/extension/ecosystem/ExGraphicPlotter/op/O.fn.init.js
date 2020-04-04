import Ux from 'ux';

export default (reference, initState = {}) => {
    const {data = {}, $current} = reference.props;
    const {$graphic = {}} = initState;
    /* 等待初始化 */
    const {edgeData = [], items = []} = data;
    const graphState = Ux.g6GetGraphic(items, edgeData, $current, $graphic);
    Object.assign(initState, graphState);
    return Ux.promise(initState);
}