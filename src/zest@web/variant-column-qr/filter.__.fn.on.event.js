import __Zn from './zero.uca.dependency';

// const onHooker = (config = {}, reference) => {
//     const {
//         field
//     } = config;
//     /*
//      * 这里有可能是一个Bug，这种情况下的 confirm() 函数不会触发
//      * Table 的 onChange，所以需要单独设置代码直接执行 onChange 的内部
//      * 操作。
//      */
//     let {$condition = {}} = reference.state;
//     $condition = __Zn.clone($condition);
//     if ($condition.hasOwnProperty(field)) {
//         delete $condition[field];
//     }
//     // #QR-COMMENT
//     const [state, queryRef] = __Zn.irData(reference)({$condition});
//     state.$query = queryRef.to();
//     const {options = {}} = reference.state;
//     {
//         const fields = options["search.cond"];
//         const searchFields = [];
//         fields.forEach(cond => {
//             if (0 < cond.indexOf(",")) {
//                 const expr = cond.split(',')[0];
//                 searchFields.push(expr);
//             }
//         });
//         const subset = {};
//         searchFields.forEach(field => {
//             if ($condition.hasOwnProperty(field)) {
//                 subset[field] = $condition[field];
//             }
//         });
//         if (__Zn.isEmpty(subset)) {
//             __Zn.dgDebug(subset, "雷区代码：触发钩子", "#FF4500");
//             __Zn.connectId(__Zn.Env.K_UI.BTN_CLEAR_SEARCH);
//         }
//     }
//     __Zn.dgDebug(state, "雷区代码（可能 Ant Design 中有BUG）", "#FF4500");
//     __Zn.of(reference).in(state).spinning().loading().handle(() => {
//         __Zn.dglQrFilter(reference);
//     });
// }
const __onHooker = (reference, field, selectedKeys = []) => {
    const {$condition = {}} = reference.state;
    if (0 === selectedKeys.length) {
        if ($condition.hasOwnProperty(field)) {
            delete $condition[field];
        }
    } else {
        $condition[field] = selectedKeys;
    }
    return {$condition}
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
     * #QR_LOCK
     * 视图锁定列过滤，__qr 返回之后，针对列过滤中出现的查询条件执行过滤，如果包含了
     * 某个列，则直接判断此列的数据为禁用状态，只有不出现在视图 $qrVLock 中的列是可
     * 编辑的，即有了视图之后，该列过滤会直接被锁定，但此值的更改只局限于
     * 1）视图管理
     * 2）查询条件变更
     * 后端定义
     */
    isLock: (attrEvent, reference) => {
        const {$qrVLock = []} = reference.state ? reference.state : {};
        const {field} = attrEvent;
        return $qrVLock.includes(field);
    },
    /*
     * $keyword 处理
     * {
     *     field: text,
     *     field: text
     * }
     */
    onChangeFn: (config = {}) => (event) => {
        const {
            field,
            setSelectedKeys,
            setSearchText,
        } = config;
        if (!field) {
            console.error("对不起，字段名为空，不可操作！")
            return;
        }
        const keyword = __Zn.ambEvent(event);
        const keys = keyword ? [keyword] : [];
        setSelectedKeys(keys);
        setSearchText(keyword);
    },
    onCheckedFn: (config = {}) => (keys) => {
        const {
            field,
            setSelectedKeys,
            setSearchOption,
        } = config;
        if (!field) {
            console.error("对不起，字段名为空，不可操作！")
            return;
        }
        setSelectedKeys(keys);
        setSearchOption(keys);
    },
    onConfirmFn: (config = {}, reference) => () => {
        const {
            field,
            confirm,
            selectedKeys,
            // value,

            setSearchText,
            setSearchOption,
        } = config;

        if (setSearchText) setSearchText(selectedKeys[0]);
        if (setSearchOption) setSearchOption(selectedKeys);

        const state = __onHooker(reference, field, selectedKeys);
        __Zn.of(reference).in(state).handle(() => {
            confirm();
            __Zn.connectId(__Zn.Env.K_UI.BTN_CLEAR_KEYWORD);
        })
        // if (__Zn.isArray(value) && 0 < value.length
        //     && 0 === selectedKeys.length) {
        //     onHooker(config, reference);
        // }
    },
    onResetFn: (config = {}, reference) => () => {
        const {
            field,
            confirm,
            clearFilters,
            setSelectedKeys,

            setSearchText,
            setSearchOption
        } = config;
        if (!field) {
            console.error("对不起，字段名为空，不可操作！")
            return;
        }
        clearFilters({confirm: false});
        setSelectedKeys([]);

        if (setSearchText) setSearchText("");
        if (setSearchOption) setSearchOption([]);

        const state = __onHooker(reference, field, []);
        __Zn.of(reference).in(state).handle(() => {
            confirm();
            __Zn.connectId(__Zn.Env.K_UI.BTN_CLEAR_KEYWORD);
        })
    }
}