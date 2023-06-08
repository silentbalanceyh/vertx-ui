// 禁止：import __A from './fn.atomic.foundation';
import Immutable from "immutable";
import __Is from './fn.under.is.decision';
import __E from './fn.debug.fx.error';

const itObject = (data = {}, executor = () => {
}, invalid = false) => {
    // Fix: Cannot read properties of null (reading 'toJS')
    if (data) {
        const iterator = Immutable.fromJS(data).toJS();
        // eslint-disable-next-line
        for (const key in iterator) {
            if (iterator.hasOwnProperty(key) &&
                data.hasOwnProperty(key)) {
                const value = data[key];
                if (invalid) {
                    executor(key, value);
                } else {
                    /* false / null / 0 都属于业务边界值 */
                    if (undefined !== value) {
                        executor(key, value);
                    }
                }
            }
        }
    }
};
const itTree = (treeArray = [], executor) => {
    if (__Is.isFunction(executor)) {
        let $tree;
        if (!__Is.isArray(treeArray)) {
            $tree = [treeArray]
        } else {
            $tree = treeArray;
        }
        $tree.forEach(item => {
            executor(item);
            if (item.children && 0 < item.children.length) {
                itTree(item.children, executor);
            }
        })
    }
};
const itElement = (data = [], field = "", itemFun = () => {
}) => {
    __E.fxTerminal(!__Is.isArray(data), 10071, data, "Array");
    __E.fxTerminal(!__Is.isFunction(itemFun), 10071, itemFun, "Function");
    data.forEach(item => {
        if (item) {
            if (__Is.isArray(item[field])) {
                itElement(item[field], field, itemFun);
            } else {
                item[field] = itemFun(item[field], item);
            }
        }
    });
};
const itAmb = (input, consumer) => {
    if (__Is.isFunction(consumer)) {
        if (__Is.isArray(input)) {
            const normalized = [];
            input.map(each => itAmb(each, consumer))
                .forEach(each => normalized.push(each));
            return normalized;
        } else {
            return consumer(input);
        }
    } else return input;
}
const itRepeat = (loop = 0, consumer) => {
    const rets = [];
    if (__Is.isFunction(consumer)) {
        for (let idx = 0; idx < loop; idx++) {
            rets.push(consumer(idx));
        }
    }
    return rets;
}
export default {
    itObject,
    itTree,
    itElement,
    itAmb,
    itRepeat,
}