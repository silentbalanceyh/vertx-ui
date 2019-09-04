import {createAction} from 'redux-act';
import Cv from '../constant';
import {zero} from "environment";
import entity from './O.entity';
import Uarr from './O.Uarr';
import Uson from './O.Uson';

export default {
    createAction: (path) => createAction(`${Cv.KEY_EVENT}${path}`),
    ...entity,

    Uarr,
    Uson,
    zero,
}