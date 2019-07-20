import Ux from 'ux';
import I from '../api';

import Types from './types.application';
import Proc from './proc.application';

export default {
    fnExApp: Ux.rxEdict(Types.fnExApp, I.app, Proc.fnExApp),
    fnExInit: Ux.rxEdict(Types.fnExInit, I.inited, Proc.fnExInit)
}