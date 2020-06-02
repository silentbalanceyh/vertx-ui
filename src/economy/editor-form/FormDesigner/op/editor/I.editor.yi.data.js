import Ux from 'ux';
import Cmn from '../library'

export default (reference, state = {}) => {
    /* 初始化行专用操作 */
    const key = `row-${Ux.randomString(8)}`;
    const {data = {}} = reference.props;
    const span = 24 / data.columns;     // 计算列宽度
    state.$config = Ux.clone(data);     // 原始配置
    state.$rows = [{
        key,
        /* 修改节点 */
        data: [Cmn.cellNew(span, 0)]
    }];
    return Ux.promise(state);
}