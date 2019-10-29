import yiModule from "./yi.module";
import yiAssist from './yi.assist';
import Ux from 'ux';

import yiRouterType from "./yi.router.type";

export default (reference, inputState = {}) => {
    /*
     * 读取参数信息
     */
    const state = {};
    if (inputState) {
        Object.assign(state);
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
            reference.setState(data);
        })
}