import __Zn from './zero.module.dependency';
import __QRP from './query.__.fn.qr.processor';
import __CAL from './query.fn.ir.syntax.calculate';

const Cv = __Zn.Env;

const qrMessage = (data = {}, config = {}, form = {}) => {
    const {
        pattern = {}
    } = config;
    const {
        options = {}
    } = form;
    const message = [];
    const parsedConnector = {};
    {
        const {messageConnect = {}} = config;
        Object.assign(parsedConnector, messageConnect);
        parsedConnector.value = __CAL.irSwitcher(null).message(data)
    }
    // const parsedConnector =
    //     __qrConnector(data, config);
    message.push(parsedConnector);
    Object.keys(data)
        .filter(key => "connector" !== key)
        .filter(key => !!key)
        .forEach(key => {
            const kv = key.split(',');
            const tpl = pattern[kv[1]];
            let field = kv[0];
            let value = data[key];
            if (__Zn.isNotEmpty(options)) {
                let title = __Zn.elementUnique(options, "key", field, "label");
                if (__Zn.isNotEmpty(title)) {
                    field = title;
                    let index = __Zn.elementIndex(options, field, "label");
                    let label = [];
                    if (__Zn.isNotEmpty(options[index].config.options)) {
                        if (__Zn.isArray(value)) {
                            value.forEach(val => {
                                label.push(__Zn.elementUnique(options[index].config.options, "value", val, "label"));
                            })
                        } else {
                            label.push(__Zn.elementUnique(options[index].config.options, "value", value, "label"));
                        }
                    } else if (__Zn.isNotEmpty(options[index].config.mapping)) {
                        label.push(options[index].config.mapping[value]);
                    } else if (__Zn.isNotEmpty(options[index].config.format)) {
                        label.push(__Zn.formatDate(value, options[index].config.format))
                    }
                    if (__Zn.isNotEmpty(label)) {
                        value = label;
                    }
                }
            }
            const params = {
                name: field,
                value: value
            };
            message.push({
                text: __Zn.formatExpr(tpl, params, true),
                field,
                fieldCond: key,
                key: key,
            });
        });

    if (__Zn.isEmpty(data)) {
        return {
            connector: parsedConnector.value,
            message,
        }
    } else {
        return {
            connector: parsedConnector.value,
            message,
        }
    }
}

const qrTerms = (columns = []) => {
    /*
     * 在列确认之后，执行 $terms 变量的注入
     * $terms 记录了列变更的类型，用于后续的列变更专用处理
     */
    let $terms = {};
    if (__Zn.isArray(columns)) {
        /*
         * 1）列定义中包含了当前字段（ dataIndex = field ）
         * 2）列定义中包含了 $filter 字段
         * 3）直接读取 $filter 中的 type 类型
         * 4）$filter 中的 type 值默认：INNER-DIRECT
         */
        columns.forEach(column => {
            const field = column.dataIndex;
            const filter = column[Cv.K_NAME.FILTER];
            if (filter) {
                $terms[field] = {};
                $terms[field].type = filter.type ? filter.type : Cv.QR_COLUMN.DIRECT;
                const {config = {}} = filter;
                if (config.dataType) {
                    $terms[field].dataType = config.dataType;
                } else {
                    // 默认的搜索模式
                    $terms[field].dataType = "STRING";
                }
            }
        });
    }
    Object.freeze($terms);
    return $terms;
};
const qrInput = (cond = [], value) => {
    const condition = {};
    if (value) {
        cond.forEach(field => condition[field] = value);
    } else {
        cond.forEach(field => condition[field] = Cv.CV_DELETE);
    }
    condition[""] = false;
    return __QRP.qrFinalize(condition);
};
// const qrClear = (reference = {}, state = {}) => {
//     let append = state ? state : {};
//     Object.assign(append, {$condition: {}});
//     __Zn.of(reference).in(append).handle(() => {
//
//         const {$terms = {}} = reference.state ? reference.state : {};
//         __ACT.activeColumn($terms);
//     })
//     // reference.?etState(append);
//     //
//     // const {$terms = {}} = reference.state ? reference.state : {};
//     // __ACT.activeColumn($terms);
// };
export default {
    qrInput,
    qrTerms,
    qrMessage,
}
