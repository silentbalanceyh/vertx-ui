import __Zn from './zero.module.dependency';
import __Pr from './syntax.fn.parse.component';

import __AY_RULE from './syntax.fn.apply.rule';
import __AY_WEB from './syntax.fn.apply.component';
import __AY_ATTR from './syntax.fn.apply.attribute';

const __AY = {
    ...__AY_ATTR,
    ...__AY_RULE,
    ...__AY_WEB
}

const aiExprWindow = (literal = "") => {
    const item = __Pr.parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('open')) item.open = "true" === (item.open);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('width')) item.width = __Zn.valueInt(item.width);
    return item;
};
const aiExprDrawer = (drawer = "") => {
    const item = __Pr.parseItem(drawer, "drawer");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('open')) item.open = "true" === (item.open);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    if (item.hasOwnProperty('width')) item.width = __Zn.valueInt(item.width);
    return item;
};
const aiExprPopover = (popover = "") => {
    const item = __Pr.parseItem(popover, "popover");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.width) item.width = __Zn.valueInt(item.width);
    if (item.hasOwnProperty('open')) item.open = "true" === (item.open);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
const aiExprTabs = (items = []) =>
    items.map(item => __Pr.parseItem(item, "tabs"))
        .map(__AY.applyKey);

export default {
    aiExprWindow,
    aiExprDrawer,
    aiExprPopover,
    aiExprTabs,
}