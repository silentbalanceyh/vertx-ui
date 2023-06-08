import __Zs from 'zs';
/*
 * 最复杂的一个方法，用于设置 render 的最终状态
 */
const raftRender = (cell = {}, config = {}) =>
    __Zs.raftRender(cell, config);

const raftHidden = (raft = {}, $form, reference) =>
    __Zs.raftHidden(raft, $form, reference);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftRender,
    raftHidden,
}