import Ux from 'ux';
import Event from './Op.Event';

const yiPage = (reference) => {
    const state = {};
    const {config = {}, $keySet} = reference.props;
    state.$button = Ux.sexOp(reference, Event);

    const {datum = []} = config;
    const source = datum.filter(item => Ux.Env.MENU_TYPE.SIDE === item.type);
    /*
     * $validation：验证过程中必须添加的菜单
     */
    state.$validation = source.map(item => item.key);
    state.$source = Ux.toTree(source, {title: "text", sort: 'order'});
    {
        /*
         * 选择的数据的基本处理
         * 选择的数据
         */
        state.$keySet = $keySet;
        // 设置默认菜单
        state.$keyDefault = datum.filter(item => Ux.Env.MENU_TYPE.SIDE !== item.type);   // 默认值
    }
    state.$datum = datum;
    state.$ready = true;
    reference.setState(state);
}
export default {
    yiPage
}