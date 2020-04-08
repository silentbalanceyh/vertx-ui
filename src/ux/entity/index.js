import {createAction} from 'redux-act';
import Cv from '../constant';
import {zero} from "environment";
import entity from './O.entity';
import Uarr from './O.Uarr';
import Uson from './O.Uson';
import Rx from './O.rx';

export default {
    /**
     * ## 集成函数
     *
     * 创建 redux 中所需要的 Action 信息，内部调用 `redux-act`。
     *
     * @memberOf module:_redux
     * @param {String} path 核心路径信息，不同的 redux 的 Action可以使用不同的值。
     * @return {EmptyActionCreator} 返回创建好的 Action。
     */
    createAction: (path) => createAction(`${Cv.KEY_EVENT}${path}`),
    ...entity,

    Uarr,
    Uson,

    ...Rx,
    zero,
}