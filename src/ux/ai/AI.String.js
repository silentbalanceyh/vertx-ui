import Op from '../Ux.Op';
import U from 'underscore';
import E from '../Ux.Error';
import {v4} from 'uuid';

/**
 * 特殊格式解析
 * @param literal
 */
const FLAG = {
    n: "name",
    x: "text",
    l: "label",
    d: "display",
    i: "icon",
    t: "title",
    s: "style"
};
const _style = (literal = "") => {
    const styleArr = literal.split(':');
    const style = {};
    style.fontSize = `${styleArr[0]}px`;
    style.color = `${styleArr[1]}`;
    return style;
};
const _iterator = (array = [], callback, objectCallback = data => data) => {
    const items = [];
    array.forEach(each => {
        if ("string" === typeof each) {
            each = each.replace(/ /g, '');
            const item = callback(each.split(','));
            items.push(item);
        } else {
            items.push(objectCallback(each));
        }
    });
    return items;
};
const aiExpr = (literal = "", flag = ["n", "i", "s"]) => {
    /**
     * 默认：
     * 0 - name / text / title / label / display
     * 1 - icon
     * 2 - style ( color, fontSize )
     * 3 -
     */
    const values = literal.split(',');
    const item = {};
    item[FLAG[flag[0]]] = values[0];
    item[FLAG[flag[1]]] = values[1];
    // style专用解析
    item[FLAG[flag[2]]] = _style(values[2]);
    return item;
};
/**
 * 默认：
 * 0 - key
 * 1 - title
 */
const aiExprColumn = (columns = []) => _iterator(columns, (values = []) => {
    const column = {};
    column.dataIndex = values[0];
    column.title = values[1];
    return column;
});
/**
 * 默认：
 * 0 - key / value
 * 1 - label
 * 2 - style
 */
const aiExprOption = (options = []) => _iterator(options, (values = []) => {
    const item = {};
    item.key = values[0];
    item.value = values[0];
    item.label = values[1];
    item.style = _style(values[2]);
    return item;
});
/**
 * 默认：
 * 0 - title
 * 1 - key
 * @param steps
 * @returns {Array}
 */
const aiExprHelp = (steps = []) => {
    if (!U.isArray(steps) && "string" !== typeof steps) {
        E.fxTerminal(true, 10005, steps);
    }
    let arrays = U.isArray(steps) ? steps : steps.split(',');
    return _iterator(arrays, (values = []) => {
        const item = {};
        item.title = values[0];
        item.key = v4();
        return item;
    }, item => {
        if (!item.hasOwnProperty('key')) {
            item.key = v4();
        }
        return item;
    })
};

const isSubmitting = (props = {}) => {
    const {$submitting} = props;
    const submitting = $submitting.is() ? $submitting.to() : {};
    return submitting.loading;
};
const aiExprOp = (values = []) => {
    const item = {};
    item.key = values[0];
    item.text = values[1];
    if (values[2]) {
        item.onClick = () => Op.connectId(values[2]);
    }
    item.type = values[3] ? values[3] : "default";
    if (values[4]) item.icon = values[4];
    return item;
};
/**
 * 默认：
 * 0 - key / value
 * 1 - label
 * 2 - style
 */
const aiExprButton = (buttons = [], props = {}) => _iterator(buttons, (values = []) => {
    const item = aiExprOp(values);
    item.loading = isSubmitting(props);
    return item;
}, item => {
    if (item.connectId) {
        const connectId = item.connectId;
        item.loading = isSubmitting(props);
        item.onClick = () => Op.connectId(connectId);
        delete item.connectId;
    }
    return item;
});
export default {
    aiExprHelp,
    aiExpr,
    aiExprColumn,
    aiExprOption,
    aiExprButton,
    aiExprOp
}