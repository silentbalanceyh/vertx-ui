import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    const {data = [], $app} = reference.props;
    const $source = Ux.clone(data);
    $source.forEach(item => item.sort = item.order);
    /*
     * 过滤菜单
     */
    let filtered = Ux.clone($source)
        .filter(item => Ux.Env.MENU_TYPE.APP === item.type)
        .sort((left, right) => left.sort - right.sort);
    state.$data = Ux.toLink(filtered, $app);
    reference.setState(state);
};
export default {
    yiPage,
}