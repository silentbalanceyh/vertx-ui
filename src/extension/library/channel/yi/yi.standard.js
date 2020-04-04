import yiModule from "./yi.module";
import yiAssist from './yi.assist';
import Ux from 'ux';
import U from 'underscore';

import yiRouterType from "./yi.router.type";
/*
 * 二义性方法
 */
export default (reference, inputState) => {
    /*
     * 读取参数信息
     */
    const state = {};
    if (inputState && U.isObject(inputState)) {
        Object.assign(state, inputState);
    }
    return yiModule(reference, state)
        .then(data => {
            reference.setState(data);
            return Ux.promise(data);
        })
        .then(data => yiAssist(reference, data))
        .then(data => yiRouterType(reference, data))
        .then(data => {
            data.$ready = true;
            if (inputState) {
                return Ux.promise(data);
            } else {
                reference.setState(data);
            }
        })
}