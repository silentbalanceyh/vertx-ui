// Engine 内部

import __Zs from 'zs'

const raftAction = (cell = {}, reference) =>
    __Zs.raftAction(cell, reference);
export default {
    raftAction,
}