import Rdx from './Ux.Rdx';
import Rt from './Ux.Redux';
import Ir from './Ux.List';
import Parser from './Ux.Param';
import IrEx from './Ux.ExList';

export default {
    ...Rdx,
    ...Rt,
    ...Ir,
    ...IrEx,
    ...Parser
};