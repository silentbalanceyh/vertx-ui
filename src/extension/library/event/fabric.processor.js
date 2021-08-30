import Ux from "ux";

export default {
    TREE_SELECT: {
        PARENT_ALL_INCLUDE: () => async (dataEvent) =>
            dataEvent.next(Ux.treeParentAllIn(dataEvent.getPrev(), dataEvent.getData())),
        PARENT_ALL: () => async (dataEvent) =>
            dataEvent.next(Ux.treeParentAll(dataEvent.getPrev(), dataEvent.getData())),
        PARENT: () => async (dataEvent) =>
            dataEvent.next(Ux.treeParent(dataEvent.getPrev(), dataEvent.getData())),
        CURRENT: () => async (dataEvent) =>
            dataEvent.next(dataEvent.getPrev()),
        CHILDREN: () => async (dataEvent) =>
            dataEvent.next(Ux.treeChildren(dataEvent.getPrev(), dataEvent.getData())),
        CHILDREN_ALL: () => async (dataEvent) =>
            dataEvent.next(Ux.treeChildrenAll(dataEvent.getPrev(), dataEvent.getData())),
        CHILDREN_ALL_INCLUDE: () => async (dataEvent) =>
            dataEvent.next(Ux.treeChildrenAllIn(dataEvent.getPrev(), dataEvent.getData())),
    },
    UNIQUE: {
        LITERAL: () => async (dataEvent) => {
            const input = dataEvent.getPrev();
            return input[0];
        },
        __DEFAULT__: (params) => async (dataEvent) => {
            const input = dataEvent.getPrev();
            if (1 >= input.length) {
                const result = input[0];
                if (result) {
                    const path = params[0];
                    if (path) {
                        return Ux.valuePath(result, path);
                    } else {
                        /*
                         * 没有配置任何参数，直接返回唯一对象
                         */
                        return result;
                    }
                } else {
                    /*
                     * 长度为0，直接返回 undefined
                     */
                    return null;
                }
            } else {
                console.error("[ EvR ] 过滤过后的长度不对！", input);
            }
        }
    },
    FILTER: {
        EQ: (params = []) => async (dataEvent) => {
            const data = dataEvent.getData();
            const input = dataEvent.getPrev();
            let field = params[0] ? params[0] : "key"; // 按主键过滤
            return data.filter(item => input === item[field]);
        },
        IN: (params = []) => async (dataEvent) => {
            const input = dataEvent.getPrev();
            const data = dataEvent.getData();
            let field = params[0] ? params[0] : "key";
            return data.filter(item => input.includes(item[field]));
        }
    },
    CRITERIA: {
        IN: (params = []) => async (dataEvent) => {
            const input = dataEvent.getPrev();
            const condition = {};
            if (0 < params.length) {
                condition[`${params[0]},i`] = input;
            }
            return condition;
        }
    },
    MAP: {
        __DEFAULT__: (params = []) => async (dataEvent) => {
            const input = dataEvent.getPrev();
            if (Ux.isArray(input)) {
                return input.map(item => {
                    const field = params[0] ? params[0] : undefined;
                    if (field) {
                        return Ux.valuePath(item, field);
                    } else {
                        return item;
                    }
                })
            } else {
                console.error("[ EvR ] 输入类型不对，必须是数组！", input);
            }
        }
    },
    ZIP: {
        INDEX_TO: (params = []) => async (dataEvent) => {
            const input = dataEvent.getPrev();
            const expression = params[0];
            if (expression) {
                const next = {};
                const kv = expression.split('`');
                kv.forEach(each => {
                    const indexFields = each.split('=');
                    const index = indexFields[0];
                    const field = indexFields[1];
                    if (index && field) {
                        const value = input[index];
                        if (value) {
                            next[field] = value;
                        }
                    }
                });
                return next;
            } else {
                console.error("[ EvR ] 表达式缺乏！", params);
            }
        }
    },
    INPUT: {
        PROP: (params = []) => async (dataEvent) => {
            const ref = dataEvent.getRef();
            if (ref && ref.props) {
                const props = ref.props;
                const field = params[0];
                return Ux.valueFind(props, field.split('.'));
            } else {
                console.error("[ EvR ] 事件处理！", ref);
            }
        }
    },
    FIELD: {
        __DEFAULT__: (params = []) => async (dataEvent) => {
            /*
             * 读取所有的 params
             */
            const prev = dataEvent.getPrev();
            let returnValue = null;
            for (let idx = 0; idx < params.length; idx++) {
                const field = params[idx];
                if (prev && field) {
                    returnValue = prev[field];
                }
                if (returnValue) {
                    break;
                }
            }
            return returnValue;
        }
    },
    DATUM: {
        __DEFAULT__: (params = []) => async (dataEvent) => {
            const ref = dataEvent.getRef();
            const value = dataEvent.getPrev();
            const source = params[0];
            const condField = params[1];
            const data = Ux.elementUniqueDatum(ref, source, condField, value);
            return data ? data : {};
        }
    },
    DIALOG: {
        VISIBLE: (params = []) => async (dataEvent) => {
            const normalized = {};
            normalized.$visible = true;
            normalized.$current = dataEvent.getPrev();
            return normalized;
        }
    }
}