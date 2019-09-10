import E from "../../error";

import Cmn from './I.common';

export default (reference, jsx) => {
    const buttons = jsx.buttons;
    E.fxTerminal(!buttons.hasOwnProperty('submit'), 10074, 'submit');
    const normalized = [];
    // 提交按钮解析
    const item = Cmn.exprSubmit(reference, buttons.submit);
    normalized.push(item);
    if (buttons.reset) {
        // 重置按钮属性
        const reset = Cmn.exprReset(reference, buttons.reset);
        normalized.push(reset);
    }
    return normalized;
};