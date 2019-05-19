import Cfg from './Fx.Config';
import Mock from './Fx.Mock';
import Ux from 'ux';

export default (ref) => {
    const config = Cfg.hocConfig("grid")(ref);
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

}