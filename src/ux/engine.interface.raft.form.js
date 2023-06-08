// 导入当前目录
// 导入外层
import __Zs from 'zs';

const raftUi = (reference = {}, ui = [], rule = {}) =>
    __Zs.raftUi(reference, ui, rule);
/*
 * 构造Form的基本属性信息
 */
const raftAttribute = (raft = {}, params = {}) =>
    __Zs.raftAttribute(raft, params);
/*
 * 计算整体布局信息
 */
const raftLayout = (raft = {}, params = {}) =>
    __Zs.raftLayout(raft, params);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // aiValidator:,
    raftAttribute,
    raftUi,
    raftLayout
}