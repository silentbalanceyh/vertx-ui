import __Zn from './zero.module.dependency';

const applyConnect = (item = {}) => {
    if (item.hasOwnProperty("connectId")) {
        const connectId = item.connectId;
        item.onClick = __Zn.connectIdFn(connectId);
        delete item.connectId;
    }
    return item;
}
const applyKey = (item = {}) => {
    if (!item.hasOwnProperty('key')) {
        item.key = __Zn.randomUUID();
    }
    return item;
};
const applyValue = (item = {}) => {
    if (item.hasOwnProperty("key") && !item.hasOwnProperty("value")) {
        item.value = item.key;
    }
    return item;
}
const applyStyle = (item = {}) => {
    if (item.hasOwnProperty('style')) {
        const literal = item.style;
        // "24:blue",
        if ("string" === typeof literal) {
            const styleArr = literal.split(':');
            const style = {};
            style.fontSize = `${styleArr[0]}px`;
            style.color = `${styleArr[1]}`;
            item.style = style;
        }
    }
    return item;
};
const applyLoading = (item = {}, props) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};
const applyArray = (literal) => __Zn.isArray(literal) ? literal : literal.split(',');
const applyInput = (item = {}, config = [], kvs = []) => {
    /*
     * 查找定义的 $KV$ 的索引
     */
    let kvIndex = -1;
    config.forEach((item, index) => {
        if (__Zn.Env.SYNTAX_KV === item) {
            kvIndex = index;
        }
    });
    /*
     * kvs 的变幻
     * 1）超过 $KV$ 索引的位置执行 '' 的压缩，也就是 $KV$ 之后丢弃掉空字符串
     * 2）压缩的时候需要保留 $KV$ 之前的应用
     */
    const compress = [];
    if (0 < kvIndex) {
        kvs.forEach((kv, index) => {
            if (index < kvIndex) {
                compress.push(kv);
            } else {
                if (kv) {
                    compress.push(kv);
                }
            }
        });
    } else {
        kvs.forEach(kv => compress.push(kv));
    }
    /*
     * 执行压缩过后的处理操作
     */
    let $item = __Zn.immutable(item);
    for (let idx = 0; idx < config.length; idx++) {
        const name = config[idx];
        if (compress[idx]) {
            if (0 < name.indexOf(".")) {
                $item = $item.setIn(name.split('.'), compress[idx]);
            } else {
                $item = $item.set(name, compress[idx]);
            }
        }
    }
    return $item.toJS();
};
export default {
    applyArray,
    applyConnect,
    applyKey,
    applyValue,
    applyStyle,
    applyLoading,
    applyInput,
}