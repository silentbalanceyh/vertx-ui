import Ux from 'ux';
import Types from './types.application';
import I from '../api';

export default {
    fnExApp: Ux.rxEdict(Types.fnExApp,
        I.app,
        data => ({app: Ux.storeApp(data)})
    )
}