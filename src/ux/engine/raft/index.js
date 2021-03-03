import form from './O.raft.form';
import row from './O.raft.row';
import cell from './O.raft.cell';
import column from './O.raft.column';
import render from './O.raft.render';
import container from './O.raft.container';
import Normalizer from './O.raft.normalizer';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...form,
    ...row,
    ...cell,
    ...column,
    ...render,
    ...container,
    Normalizer,
}