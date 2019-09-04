import form from './O.raft.form';
import row from './O.raft.row';
import cell from './O.raft.cell';
import column from './O.raft.column';
import render from './O.raft.render';
import Normalizer from './O.raft.normalizer';

export default {
    ...form,
    ...row,
    ...cell,
    ...column,
    ...render,
    Normalizer,
}