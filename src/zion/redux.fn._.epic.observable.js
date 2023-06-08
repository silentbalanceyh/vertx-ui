import {Taper} from "environment";
import {createAction} from 'redux-act';
import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

export default {
    fnOut: Taper.fnFlush,

    createAction: (path) => createAction(`${Cv.KEY_EVENT}${path}`),
}