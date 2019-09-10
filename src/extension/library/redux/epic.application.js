import Ux from 'ux';
import I from '../ajax';

import Types from './types';
import Proc from './proc.application';

export default {
    epicApp: Ux.rxEdict(Types.epicApp, I.app, Proc.procApp),
    epicInit: Ux.rxEdict(Types.epicInit, I.inited, Proc.procInit)
}