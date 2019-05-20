import Cfg from './Fx.Config';
import Mock from './Fx.Mock';
import Q from './Fx.Query';
import Ux from 'ux';

import Tab from './Fx.Tab';

export default type => ref => {
    const config = Cfg.hocConfig(type)(ref);
    const reactState = {};
    /*
     * 准备 Redux 中的状态
     */
    const defaultQuery = Ux.irGrid(config.query, ref);
    reactState.query = Q.input(ref, defaultQuery);
    // const reduxState = {"grid.query": queryData};
    /*
     * 准备 React 中的状态
     */
    reactState.mock = Mock.isMock(ref, config.options);

    /*
     * 准备 Tabs 的初始化状态
     */
    reactState.tabs = Tab.init(ref, config.options);

    reactState.table = Ux.clone(config.table);
    /*
     * 处理当前 Grid 页面所有操作
     */
    // const op = {};
    // 1. op.add、是否开启添加
    // op.add = Op.initAdd(ref, config.options);
    // reactState.op = op;

    /*
     * 存储 options 到 状态中（以后就不用每次都读取了）
     */
    reactState.options = Ux.clone(config.options);
    return reactState;
};