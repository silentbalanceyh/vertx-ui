import Cfg from './Fx.Config';
import Q from './Fx.Query';
import Ux from 'ux';

import Tab from './Fx.Tab';

export default type => ref => {
    const config = Cfg.hocConfig(type)(ref);
    const reactState = {};
    /*
     * query 状态保存，根容器保存了 query 的状态
     * 1. 如果外置 $query 传入，那么会更新 query
     * 2. query 合并过后执行根容器的 update 方法，然后将 query 传入给 IxTable
     * 3. 当前组件：state -> query 会转换成 props -> $query 转入给 IxTable
     */
    const defaultQuery = Ux.irGrid(config.query, ref);
    reactState.query = Q.input(ref, defaultQuery);
    /*
     * 准备 Tabs 的初始化状态
     * 1. 打开 Tab
     * 2. 关闭 Tab
     */
    reactState.tabs = Tab.init(ref, config.options);
    /*
     * 原始配置专用
     */
    reactState.config = Ux.clone(config);
    /*
     * 存储 options 到 状态中（以后就不用每次都读取了）
     * 1. options 中的配置众多，单独提取出来
     */
    reactState.options = Ux.clone(config.options);
    return reactState;
};