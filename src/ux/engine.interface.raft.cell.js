import __Zs from 'zs';

const raftItem = (item = {}, values = {}, config = {}) =>
    __Zs.raftItem(item, values, config);

const raftCell = (cell = {}, config = {}, raft) =>
    __Zs.raftCell(cell, config, raft);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftCell,
    raftItem,
}