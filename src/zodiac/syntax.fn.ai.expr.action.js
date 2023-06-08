import __Zn from './zero.module.dependency';
import __Pr from './syntax.fn.parse.component';
import __Zt from './syntax.__.fn._.zone';

import __AY_RULE from './syntax.fn.apply.rule';
import __AY_WEB from './syntax.fn.apply.component';
import __AY_ATTR from './syntax.fn.apply.attribute';

const __AY = {
    ...__AY_ATTR,
    ...__AY_RULE,
    ...__AY_WEB
}

const aiExprAjax = (ajax = {}) => {
    // 默认是POST方法
    let item = ajax;
    const {metadata, ...rest} = ajax;
    if (metadata) {
        // 如果是对象，出现了metadata才会执行属性解析
        item = __Pr.parseItem(metadata, "ajax");
        // 分页参数执行整数
        const pager = item.params.pager;
        if (pager) {
            pager.page = __Zn.valueInt(pager.page);
            pager.size = __Zn.valueInt(pager.size);
        }
        const lefts = __Zn.valueLadder(rest);
        // 只合并criteria
        if (!lefts.params) lefts.params = {};
        item.params.criteria = lefts.params.criteria;
    }
    return item;
};

const aiExprAction = (popover = "") => __Pr.parseItem(popover, "action");
const aiExprOp = (button = "") => {
    let parsed;
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            parsed = item;
        } else {
            parsed = __Pr.parseItem(button, "op");
        }
    } else {
        parsed = button;
    }
    if (parsed.key) {
        if (!parsed.id) parsed.id = parsed.key;
    }
    return parsed;
};
const aiExprCommand = (command = "") => __Pr.parseItem(command, "command");

const aiExprCommands = (commands = []) => __Zt.itPipe(commands, aiExprCommand);

const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    __Zt.itPipe(buttons, (values = []) => __Pr.parseItem(values, key))
        .map(__AY.applyConnect).map(item => __AY.applyLoading(item, props));
const aiExprButtons = (buttons = [], props = {}) => _aiExprButton(buttons, props);
// const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const aiExprButton = (literal, props = {}) => {
    let button = __Pr.parseItem(literal, "button");
    button = __AY.applyConnect(button);
    button = __AY.applyLoading(button, props);
    return button;
};
export default {
    aiExprAjax,
    aiExprAction,
    aiExprOp,

    aiExprCommand,
    aiExprCommands,

    aiExprButton,
    aiExprButtons,
}