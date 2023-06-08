import __Zs from 'zs';

const raftColumn = (raft = {}, config = {}) =>
    __Zs.raftColumn(raft, config);
const raftSpecial = (cell = {}) =>
    __Zs.raftSpecial(cell);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftColumn,
    raftSpecial,
}