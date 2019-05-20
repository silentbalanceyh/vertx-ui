import Cfg from './Fx.Config';
import Mock from './Fx.Mock';
import Tab from './Fx.Tab';
import Unity from './Fx.Unity';
import Ux from 'ux';

export default type => ref => {
    const config = Cfg.hocConfig(type)(ref);
    /*
     * 准备 Redux 中的状态
     */
    const queryData = Ux.irGrid(config.query, ref);
    const reduxState = {"grid.query": queryData};
    /*
     * 准备 React 中的状态
     */
    const reactState = {};
    reactState.mock = Mock.isMock(ref, config.options);
    reactState.tabs = Tab.init(ref, config.options);
    /*
     * 存储 options 到 状态中（以后就不用每次都读取了）
     */
    reactState.options = Ux.clone(config.options);
    /*
     * 最终状态写入
     */
    Unity.write(ref, reactState, reduxState);
}