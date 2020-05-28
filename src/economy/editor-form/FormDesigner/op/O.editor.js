import Cmn from "./I.common";
import Ux from 'ux';

export default {
    /*
     * 网格初始化
     */
    yiGrid: (reference) => {
        // const {data = {}} = reference.props;
        /* 初始化配置信息 */
        /* Form数据处理 */
        const state = {};
        /* _commands 命令工具栏 */
        state.$ready = true;
        state.$rows = [{}];
        reference.setState(state);
    },
    yiGridRow: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, state)
            .then(Ux.ready).then(Ux.pipe(reference))
    }
}