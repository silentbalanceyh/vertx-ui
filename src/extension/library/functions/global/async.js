import U from 'underscore';
import E from '../debug/error';
import Ux from 'ux';
import {Modal} from 'antd';
import Q from 'q';

/*
 * 单参数
 * 1）直接返回 Promise（新规范）
 * 双参数
 * 2）第一个为 Function，( supplier, params )
 * 三参数
 * 3）做合并
 */
function promise() {
    if (1 === arguments.length) {
        const value = arguments[0];
        return new Promise(resolve => resolve(value));
    } else if (2 === arguments.length) {
        const supplier = arguments[0];
        const params = arguments[1];
        if (U.isFunction(supplier)) {
            const promise = supplier(params);
            if (promise instanceof Promise) {
                return promise;
            } else {
                return E.error003();
            }
        } else {
            return E.error003();
        }
    } else if (3 === arguments.length) {
        const state = arguments[0];
        const key = arguments[1];
        state[key] = arguments[2];
        return promise(state);
    } else {
        return E.error006();
    }
}

const failure = (reference, error = {}) => {
    const {data = {}} = error;
    if (data.info) {
        const dialog = Ux.fromHoc(reference, 'dialog');
        const config = {};
        config.title = dialog.error;
        config.content = data.info;
        config.maskClosable = false;
        config.onOk = () => reference.setState({$loading: false});
        Modal.error(config);
    } else {
        console.error("核心错误！", error);
    }
};
const all = (promiseArray = [], ...keys) => {
    return Q.all(promiseArray)
        .then(response => {
            const result = {};
            response.forEach((item, index) => {
                const key = keys[index];
                if (key) {
                    result[key] = Ux.clone(item);
                }
            });
            return promise(result);
        })
};
export default {
    promise,
    failure,
    all,
}